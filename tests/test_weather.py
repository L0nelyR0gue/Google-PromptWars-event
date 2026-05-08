"""Tests for the weather service."""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, patch, MagicMock

from services.weather_service import (
    get_weather_forecast,
    geocode_destination,
    WEATHER_CODES,
    _cache,
)


@pytest.fixture(autouse=True)
def clear_cache():
    """Clear weather cache before each test."""
    _cache.clear()
    yield
    _cache.clear()


class TestWeatherCodes:
    """Test weather code mappings."""

    def test_clear_sky_code(self):
        assert WEATHER_CODES[0] == "Clear sky"

    def test_heavy_rain_code(self):
        assert WEATHER_CODES[65] == "Heavy rain"

    def test_thunderstorm_code(self):
        assert WEATHER_CODES[95] == "Thunderstorm"


class TestGeocode:
    """Test destination geocoding."""

    @pytest.mark.asyncio
    async def test_geocode_returns_coordinates(self):
        """Geocoding a known city should return valid coordinates."""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "results": [{"latitude": 35.6762, "longitude": 139.6503}]
        }
        mock_response.raise_for_status = MagicMock()

        with patch("services.weather_service.httpx.AsyncClient") as mock_client:
            mock_instance = AsyncMock()
            mock_instance.get.return_value = mock_response
            mock_instance.__aenter__ = AsyncMock(return_value=mock_instance)
            mock_instance.__aexit__ = AsyncMock(return_value=False)
            mock_client.return_value = mock_instance

            result = await geocode_destination("Tokyo")
            assert result is not None
            assert result == (35.6762, 139.6503)

    @pytest.mark.asyncio
    async def test_geocode_no_results(self):
        """Geocoding an unknown place should return None."""
        mock_response = MagicMock()
        mock_response.json.return_value = {"results": []}
        mock_response.raise_for_status = MagicMock()

        with patch("services.weather_service.httpx.AsyncClient") as mock_client:
            mock_instance = AsyncMock()
            mock_instance.get.return_value = mock_response
            mock_instance.__aenter__ = AsyncMock(return_value=mock_instance)
            mock_instance.__aexit__ = AsyncMock(return_value=False)
            mock_client.return_value = mock_instance

            result = await geocode_destination("xyznonexistent12345")
            assert result is None


class TestWeatherForecast:
    """Test weather forecast fetching."""

    @pytest.mark.asyncio
    async def test_empty_forecast_on_geocode_failure(self):
        """If geocoding fails, forecast should return empty list."""
        with patch("services.weather_service.geocode_destination", return_value=None):
            result = await get_weather_forecast("Nowhere", "2026-06-01", "2026-06-03")
            assert result == []
