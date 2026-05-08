# 🏆 PromptWars: Travel Planning & Experience Engine — BATTLE PLAN

## Understanding the Challenge

**Problem**: Build a Travel Planning & Experience Engine that plans trips dynamically with preferences, constraints, and real-time updates.

**Evaluation Framework** (automated platform scoring — ALL 7 axes matter):
1. Code Quality
2. Security
3. Efficiency
4. Testing
5. Accessibility
6. Problem Statement Alignment
7. Google Services Usage

**Critical Rules**:
- Only the **final submission** score counts (not best attempt)
- Top 10 selected by leaderboard + **working Cloud Run link** (broken = DQ)
- Warm-up round scores don't count — only Challenge submission

**Budget constraint**: $5 Google Cloud credits

---

## Why This Plan Beats the DeepSeek Response

| Area | DeepSeek | Our Plan |
|------|----------|----------|
| **UI** | API-only (no web UI) | **Stunning glassmorphism web UI** — judges see a beautiful product, not just JSON |
| **Google Services** | Gemini + Places (2) | **Gemini + Maps JS + Places + Cloud Run + Secret Manager** (5 services) |
| **Testing** | 3 unit tests mentioned vaguely | **pytest with fixtures, mocking, parametrized tests, + integration test** — real coverage |
| **Accessibility** | "Add ARIA labels" mentioned | **Full a11y: semantic HTML, ARIA, keyboard nav, skip-link, prefers-reduced-motion, high-contrast** |
| **Security** | Secret Manager + rate limiting | **Secret Manager + input validation + CORS + rate limiting + CSP headers + output sanitization** |
| **Deployment** | Deploy last | **Deploy-first** — get the Cloud Run URL working ASAP, iterate on top |
| **Real-time** | Vague "plug in APIs" | **Weather API integrated into Gemini context + live re-planning endpoint** |

---

## Proposed Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLOUD RUN                          │
│  ┌──────────────────────────────────────────────┐   │
│  │           FastAPI Application                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐ │   │
│  │  │  /plan   │  │ /replan  │  │ Static UI  │ │   │
│  │  └────┬─────┘  └────┬─────┘  └────────────┘ │   │
│  │       │              │                        │   │
│  │  ┌────▼──────────────▼────────┐              │   │
│  │  │    Orchestrator Service     │              │   │
│  │  └────┬───────┬───────┬───────┘              │   │
│  │       │       │       │                       │   │
│  │  ┌────▼──┐ ┌──▼───┐ ┌▼───────┐              │   │
│  │  │Gemini │ │Weather│ │ Places │              │   │
│  │  │Service│ │Service│ │Service │              │   │
│  │  └───────┘ └──────┘ └────────┘              │   │
│  └──────────────────────────────────────────────┘   │
│            ▲                                         │
│            │ API Keys                                │
│  ┌─────────┴───────────┐                            │
│  │  Secret Manager     │                            │
│  └─────────────────────┘                            │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| Backend | **Python + FastAPI** | Async, auto-docs, strict typing with Pydantic, fast to build |
| LLM | **Gemini 2.0 Flash** | Cheapest, fastest — $5 budget safe |
| Weather | **Open-Meteo API** | **Completely free, no API key needed**, real-time forecasts |
| Places | **Google Places API (New)** | Google service credit — text search for POIs |
| Maps | **Google Maps JavaScript API** | Google service — embedded map in UI |
| Secrets | **Google Secret Manager** | Google service — secure key storage |
| Deployment | **Google Cloud Run** | Required by problem statement |
| Frontend | **Single-page HTML/CSS/JS** served by FastAPI | Gorgeous UI, no build step, fast |

> [!IMPORTANT]
> **Budget strategy**: Gemini Flash is ~$0.10/1M tokens. Open-Meteo is free. We only pay for Places API calls (~$0.03/call) and Cloud Run ($0 for low usage). We can easily stay under $5.

---

## Proposed Changes

### Project Structure

```
travel-engine/
├── main.py                    # FastAPI app with all routes + static files
├── config.py                  # Settings via env vars / Secret Manager
├── models.py                  # Pydantic models (strict typing)
├── services/
│   ├── __init__.py
│   ├── gemini_service.py      # Gemini API integration
│   ├── weather_service.py     # Open-Meteo (free, no key)
│   ├── places_service.py      # Google Places API
│   └── orchestrator.py        # Ties services together
├── security.py                # Input validation, rate limiting, CSP
├── static/
│   ├── index.html             # Beautiful single-page UI
│   ├── style.css              # Glassmorphism design system
│   └── app.js                 # Frontend logic + Maps integration
├── tests/
│   ├── __init__.py
│   ├── conftest.py            # Shared fixtures
│   ├── test_models.py         # Pydantic model validation tests
│   ├── test_weather.py        # Weather service tests
│   ├── test_orchestrator.py   # Integration test with mocked APIs
│   └── test_security.py       # Input sanitization tests
├── Dockerfile                 # Multi-stage, slim, non-root user
├── .dockerignore
├── requirements.txt
├── README.md                  # Detailed documentation
└── .gcloudignore
```

---

### Component Breakdown

#### [NEW] `main.py` — FastAPI Application
- `GET /` → Serve the beautiful web UI
- `POST /api/plan` → Generate a trip itinerary
- `POST /api/replan` → Dynamically re-plan when conditions change
- `GET /api/health` → Health check endpoint
- CORS middleware, CSP headers, rate limiting middleware
- Structured logging

#### [NEW] `config.py` — Configuration
- Load API keys from environment variables (Cloud Run injects from Secret Manager)
- No hardcoded secrets anywhere
- Pydantic Settings for validation

#### [NEW] `models.py` — Strict Pydantic Models
- `TripRequest`: destination, dates, preferences, constraints, traveler_type
- `TripConstraints`: max_budget, max_daily_km, accessibility_needs, dietary_restrictions
- `ItineraryResponse`: day-by-day plan with activities, timings, transport, weather
- `ReplanRequest`: itinerary + disruption event
- All models with strict validation, examples, field descriptions

#### [NEW] `services/gemini_service.py`
- System prompt engineered to produce structured JSON itineraries
- Accepts weather context, places context, and constraints
- Uses `google-genai` SDK (official Google AI Python SDK)
- Structured output with response schema for reliable JSON

#### [NEW] `services/weather_service.py`
- Uses Open-Meteo API (free, no key needed!)
- Fetches daily forecast: temperature, precipitation probability, weather code
- Async HTTP calls with `httpx`
- TTL cache (5 min) to avoid redundant calls

#### [NEW] `services/places_service.py`
- Uses Google Places API (New) — Text Search
- Searches for attractions, restaurants, activities matching preferences
- Filters by accessibility if needed
- Cached results per destination+category

#### [NEW] `services/orchestrator.py`
- Fetches weather + places in parallel (`asyncio.gather`)
- Builds enriched context for Gemini
- Handles re-planning by injecting disruption into context
- Returns structured itinerary

#### [NEW] `security.py`
- Input sanitization (strip HTML/script tags from all string inputs)
- Rate limiter (in-memory, 10 req/min per IP)
- CSP headers middleware
- Request size limits

#### [NEW] `static/index.html` — Stunning Web UI
- Glassmorphism design with animated gradient backgrounds
- Form for trip inputs: destination, dates, preferences (chips), constraints
- Animated itinerary cards showing day-by-day plan
- Embedded Google Map showing route/markers
- "Disrupt & Re-plan" button (simulate flight delay, rain, closure)
- Fully accessible: ARIA labels, keyboard navigation, skip-to-content link, focus indicators
- `prefers-reduced-motion` media query support
- High contrast mode toggle

#### [NEW] `static/style.css`
- CSS custom properties (design tokens)
- Dark mode glassmorphism aesthetic
- Smooth transitions and micro-animations
- Responsive layout (mobile → desktop)
- Accessible focus styles, contrast ratios

#### [NEW] `static/app.js`
- Fetch-based API calls
- Google Maps JS SDK integration (markers, polylines)
- DOM manipulation for itinerary rendering
- Loading states, error handling
- Keyboard event handlers for accessibility

#### [NEW] `tests/` — Comprehensive Test Suite
- `test_models.py`: Pydantic validation (valid input, missing fields, bad dates, negative budget)
- `test_weather.py`: Mock Open-Meteo responses, test parsing
- `test_orchestrator.py`: Mock all services, verify itinerary structure
- `test_security.py`: XSS attempt blocked, rate limit works
- Uses `pytest`, `pytest-asyncio`, `httpx` for async testing

#### [NEW] `Dockerfile`
- Multi-stage build (builder → runtime)
- `python:3.11-slim` base (not 3.14 — Cloud Run compatibility)
- Non-root user for security
- Expose port 8080
- Health check instruction

#### [NEW] `README.md`
- Project overview with problem alignment
- Architecture diagram
- Setup instructions (local + Cloud Run)
- API documentation with curl examples
- Google services used (explicit list)
- Security measures documented
- Accessibility features documented

---

## Execution Strategy (ORDER MATTERS)

> [!IMPORTANT]
> **Deploy-first approach**: We get a basic working version on Cloud Run FIRST, then iterate. This ensures we never get DQ'd for a broken link.

### Phase 1: Scaffold + Deploy Skeleton (30 min)
1. Create project structure
2. Build minimal FastAPI with `/` and `/api/health`
3. Create Dockerfile
4. Deploy to Cloud Run → **GET THE URL WORKING**

### Phase 2: Core Engine (45 min)
1. Build Pydantic models
2. Build weather service (Open-Meteo, free)
3. Build Gemini service with structured output
4. Build orchestrator
5. Wire up `/api/plan` endpoint
6. Test locally, redeploy

### Phase 3: Beautiful UI (30 min)
1. Build glassmorphism HTML/CSS
2. Wire up JS to API
3. Add Google Maps integration
4. Add re-planning UI
5. Redeploy

### Phase 4: Security + Tests (20 min)
1. Input validation
2. Rate limiting
3. CSP headers
4. Write all tests
5. Redeploy

### Phase 5: Polish + Documentation (15 min)
1. README.md
2. Accessibility audit
3. Final deployment
4. Test the Cloud Run URL

---

## Open Questions

> [!IMPORTANT]
> **Question 1**: Do you have a Google Cloud project already set up with billing enabled? If not, have you already claimed the $5 credits? We need to know the project ID.

> [!IMPORTANT]  
> **Question 2**: Do you have gcloud CLI installed or do we need to install it? (I didn't find it on your system.) We'll need it for deploying to Cloud Run.

> [!IMPORTANT]
> **Question 3**: Do you have your Gemini API key ready? We'll need it to test locally before deploying.

> [!IMPORTANT]
> **Question 4**: How much time do you have left in the hackathon? This affects whether we go for the full plan or a trimmed version.

---

## Verification Plan

### Automated Tests
```bash
py -m pytest tests/ -v --tb=short
```
- All 4 test files must pass
- Test model validation, weather parsing, orchestrator flow, security

### Manual Verification
1. **Cloud Run URL** works — `curl https://<url>/api/health` returns 200
2. **Web UI** loads in browser with beautiful design
3. **Plan endpoint** returns valid itinerary JSON
4. **Re-plan endpoint** modifies itinerary based on disruption
5. **Accessibility**: Tab through entire UI, screen reader test
6. **Security**: Try XSS in destination field — should be sanitized

### Budget Check
- Monitor Cloud Console billing dashboard
- Expected cost: < $1 total (Gemini Flash + Places + Cloud Run)
