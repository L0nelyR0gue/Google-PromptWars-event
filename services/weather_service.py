"""Weather service using Open-Meteo API (free, no key required).

Provides real-time weather forecasts for trip planning.
"""

import logging
import time
from typing import Any

import httpx

logger = logging.getLogger(__name__)

WEATHER_CODES: dict[int, str] = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail",
}

_cache: dict[str, tuple[float, Any]] = {}
CACHE_TTL_SECONDS = 300


def _get_cached(key: str) -> Any | None:
    if key in _cache:
        ts, data = _cache[key]
        if time.time() - ts < CACHE_TTL_SECONDS:
            return data
        del _cache[key]
    return None


def _set_cached(key: str, data: Any) -> None:
    _cache[key] = (time.time(), data)


async def geocode_destination(destination: str) -> tuple[float, float] | None:
    """Convert destination name to lat/lon using Open-Meteo geocoding."""
    cache_key = f"geo:{destination.lower().strip()}"
    cached = _get_cached(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                "https://geocoding-api.open-meteo.com/v1/search",
                params={"name": destination, "count": 1, "language": "en"},
            )
            resp.raise_for_status()
            data = resp.json()
            if "results" in data and data["results"]:
                r = data["results"][0]
                coords = (r["latitude"], r["longitude"])
                _set_cached(cache_key, coords)
                return coords
    except (httpx.HTTPError, KeyError) as e:
        logger.error("Geocoding failed for '%s': %s", destination, e)
    return None


async def get_weather_forecast(
    destination: str, start_date: str, end_date: str,
) -> list[dict[str, Any]]:
    """Fetch weather forecast from Open-Meteo (free, no API key)."""
    cache_key = f"weather:{destination.lower()}:{start_date}:{end_date}"
    cached = _get_cached(cache_key)
    if cached:
        return cached

    coords = await geocode_destination(destination)
    if not coords:
        return []

    lat, lon = coords
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": lat, "longitude": lon,
                    "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
                    "timezone": "auto",
                    "start_date": start_date, "end_date": end_date,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            daily = data.get("daily", {})
            dates = daily.get("time", [])
            forecast = []
            for i, d in enumerate(dates):
                code = daily.get("weather_code", [])[i] if i < len(daily.get("weather_code", [])) else 0
                forecast.append({
                    "date": d,
                    "temp_max_c": daily.get("temperature_2m_max", [None])[i] if i < len(daily.get("temperature_2m_max", [])) else None,
                    "temp_min_c": daily.get("temperature_2m_min", [None])[i] if i < len(daily.get("temperature_2m_min", [])) else None,
                    "precipitation_probability": daily.get("precipitation_probability_max", [0])[i] if i < len(daily.get("precipitation_probability_max", [])) else 0,
                    "weather_code": code,
                    "description": WEATHER_CODES.get(code, "Unknown"),
                    "is_rainy": code in {61, 63, 65, 80, 81, 82, 95, 96, 99},
                })
            _set_cached(cache_key, forecast)
            return forecast
    except (httpx.HTTPError, KeyError) as e:
        logger.error("Weather API failed: %s", e)
        return []
