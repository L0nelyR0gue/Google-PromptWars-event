"""Tests for the security module."""

import pytest
from security import sanitize_input, RateLimiter


class TestSanitizeInput:
    """Test suite for input sanitization."""

    def test_plain_text_unchanged(self):
        """Normal text should pass through unchanged."""
        assert sanitize_input("Hello World") == "Hello World"

    def test_script_tags_removed(self):
        """Script tags and their contents should be stripped."""
        result = sanitize_input('<script>alert("xss")</script>Hello')
        assert "<script>" not in result
        assert "alert" not in result
        assert "Hello" in result

    def test_html_tags_removed(self):
        """HTML tags should be stripped."""
        result = sanitize_input('<b>Bold</b> <a href="evil.com">Link</a>')
        assert "<b>" not in result
        assert "<a" not in result

    def test_html_entities_escaped(self):
        """HTML special chars should be escaped."""
        result = sanitize_input('Test & "quotes" <brackets>')
        assert "&amp;" in result
        assert "&quot;" in result

    def test_null_bytes_removed(self):
        """Null bytes should be stripped."""
        assert "\x00" not in sanitize_input("Hello\x00World")

    def test_long_input_truncated(self):
        """Very long input should be truncated to 1000 chars."""
        result = sanitize_input("A" * 2000)
        assert len(result) == 1000

    def test_non_string_converted(self):
        """Non-string input should be converted."""
        assert sanitize_input(123) == "123"


class TestRateLimiter:
    """Test suite for the rate limiter."""

    def test_allows_within_limit(self):
        """Requests within limit should be allowed."""
        limiter = RateLimiter(max_requests=3, window_seconds=60)
        assert limiter.is_allowed("1.2.3.4") is True
        assert limiter.is_allowed("1.2.3.4") is True
        assert limiter.is_allowed("1.2.3.4") is True

    def test_blocks_over_limit(self):
        """Requests exceeding limit should be blocked."""
        limiter = RateLimiter(max_requests=2, window_seconds=60)
        assert limiter.is_allowed("1.2.3.4") is True
        assert limiter.is_allowed("1.2.3.4") is True
        assert limiter.is_allowed("1.2.3.4") is False

    def test_different_ips_independent(self):
        """Different IPs should have independent limits."""
        limiter = RateLimiter(max_requests=1, window_seconds=60)
        assert limiter.is_allowed("1.1.1.1") is True
        assert limiter.is_allowed("2.2.2.2") is True
        assert limiter.is_allowed("1.1.1.1") is False

    def test_get_remaining(self):
        """Remaining count should be accurate."""
        limiter = RateLimiter(max_requests=5, window_seconds=60)
        limiter.is_allowed("1.2.3.4")
        limiter.is_allowed("1.2.3.4")
        assert limiter.get_remaining("1.2.3.4") == 3
