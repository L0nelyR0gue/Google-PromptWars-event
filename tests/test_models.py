"""Tests for Pydantic models validation."""

from datetime import date, timedelta

import pytest
from pydantic import ValidationError

from models import TripRequest, TripConstraints, ReplanRequest


class TestTripConstraints:
    """Test suite for TripConstraints model validation."""

    def test_default_constraints(self):
        """Default constraints should be valid."""
        c = TripConstraints()
        assert c.max_daily_walking_km == 10.0
        assert c.accessibility_needs is False
        assert c.dietary_restrictions == "none"

    def test_valid_constraints(self):
        """Custom valid constraints should pass."""
        c = TripConstraints(
            max_daily_walking_km=5.0,
            accessibility_needs=True,
            dietary_restrictions="vegetarian",
        )
        assert c.max_daily_walking_km == 5.0
        assert c.accessibility_needs is True

    def test_walking_km_too_low(self):
        """Walking km below minimum should fail."""
        with pytest.raises(ValidationError):
            TripConstraints(max_daily_walking_km=0.1)

    def test_walking_km_too_high(self):
        """Walking km above maximum should fail."""
        with pytest.raises(ValidationError):
            TripConstraints(max_daily_walking_km=100)


class TestTripRequest:
    """Test suite for TripRequest model validation."""

    def _valid_data(self, **overrides):
        base = {
            "destination": "Tokyo, Japan",
            "start_date": date.today() + timedelta(days=7),
            "end_date": date.today() + timedelta(days=10),
        }
        base.update(overrides)
        return base

    def test_valid_minimal_request(self):
        """Minimal valid request should pass."""
        req = TripRequest(**self._valid_data())
        assert req.destination == "Tokyo, Japan"
        assert req.budget_level == "moderate"
        assert req.traveler_type == "solo"

    def test_valid_full_request(self):
        """Full request with all fields should pass."""
        req = TripRequest(**self._valid_data(
            budget_level="luxury",
            preferences=["food", "temples"],
            traveler_type="family",
        ))
        assert req.budget_level == "luxury"
        assert len(req.preferences) == 2

    def test_empty_destination_fails(self):
        """Empty destination should fail validation."""
        with pytest.raises(ValidationError):
            TripRequest(**self._valid_data(destination=""))

    def test_end_before_start_fails(self):
        """End date before start date should fail."""
        with pytest.raises(ValidationError):
            TripRequest(**self._valid_data(
                start_date=date(2026, 6, 15),
                end_date=date(2026, 6, 10),
            ))

    def test_invalid_budget_level_fails(self):
        """Invalid budget level should fail."""
        with pytest.raises(ValidationError):
            TripRequest(**self._valid_data(budget_level="super_luxury"))

    def test_invalid_traveler_type_fails(self):
        """Invalid traveler type should fail."""
        with pytest.raises(ValidationError):
            TripRequest(**self._valid_data(traveler_type="army"))

    def test_preferences_sanitized(self):
        """Preferences should be stripped and lowercased."""
        req = TripRequest(**self._valid_data(preferences=["  FOOD  ", "  NATURE  "]))
        assert req.preferences == ["food", "nature"]


class TestReplanRequest:
    """Test suite for ReplanRequest model validation."""

    def test_valid_replan(self):
        """Valid replan request should pass."""
        req = ReplanRequest(
            original_destination="Paris, France",
            start_date=date(2026, 6, 1),
            end_date=date(2026, 6, 5),
            disruption="Heavy rain expected on Day 2",
        )
        assert req.disruption == "Heavy rain expected on Day 2"

    def test_short_disruption_fails(self):
        """Too-short disruption should fail."""
        with pytest.raises(ValidationError):
            ReplanRequest(
                original_destination="Paris",
                start_date=date(2026, 6, 1),
                end_date=date(2026, 6, 5),
                disruption="Rain",
            )
