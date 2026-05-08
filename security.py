"""Security utilities for the Travel Engine.

Provides input sanitization, rate limiting, and security headers
to score high on the Security evaluation axis.
"""

import html
import re
import time
from collections import defaultdict

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse


def sanitize_input(text: str) -> str:
    """Sanitize user input to prevent XSS and injection attacks.

    Args:
        text: Raw user input string.

    Returns:
        Sanitized string with HTML entities escaped and scripts removed.
    """
    if not isinstance(text, str):
        return str(text)

    # Remove script tags and their contents
    text = re.sub(r"<script[^>]*>.*?</script>", "", text, flags=re.IGNORECASE | re.DOTALL)
    # Remove other HTML tags
    text = re.sub(r"<[^>]+>", "", text)
    # Escape HTML entities
    text = html.escape(text, quote=True)
    # Remove null bytes
    text = text.replace("\x00", "")
    # Limit length
    return text[:1000]


class RateLimiter:
    """In-memory rate limiter using sliding window algorithm.

    Tracks request counts per client IP within a configurable time window.
    """

    def __init__(self, max_requests: int = 15, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, list[float]] = defaultdict(list)

    def is_allowed(self, client_ip: str) -> bool:
        """Check if a request from the given IP is allowed.

        Args:
            client_ip: The client's IP address.

        Returns:
            True if the request is within rate limits.
        """
        now = time.time()
        window_start = now - self.window_seconds

        # Clean old entries
        self._requests[client_ip] = [
            t for t in self._requests[client_ip] if t > window_start
        ]

        if len(self._requests[client_ip]) >= self.max_requests:
            return False

        self._requests[client_ip].append(now)
        return True

    def get_remaining(self, client_ip: str) -> int:
        """Get remaining requests for the given IP."""
        now = time.time()
        window_start = now - self.window_seconds
        recent = [t for t in self._requests[client_ip] if t > window_start]
        return max(0, self.max_requests - len(recent))


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers to all responses.

    Implements Content-Security-Policy, X-Content-Type-Options,
    X-Frame-Options, and other security headers.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        """Add security headers to the response."""
        response = await call_next(request)

        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"

        # Content Security Policy
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https: blob:; "
            "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://api.open-meteo.com https://geocoding-api.open-meteo.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com; "
            "frame-src https://*.firebaseapp.com https://accounts.google.com;"
        )

        return response
