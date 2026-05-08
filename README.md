# 🌍 Travel Planning & Experience Engine

> AI-powered dynamic trip planning with preferences, constraints, and real-time weather updates.  
> Built for **Google PromptWars Hackathon** — Build with AI.

## ✨ Features

- **Dynamic Itinerary Generation**: AI creates day-by-day travel plans based on your preferences, budget, and constraints.
- **Real-Time Weather Integration**: Uses Open-Meteo API to fetch live weather forecasts and adapt activities accordingly (e.g., indoor plans on rainy days).
- **Smart Re-Planning**: Simulate disruptions (flight delays, closures, weather changes) and watch the AI adapt your itinerary in real-time.
- **Google Authentication**: Secure sign-in with Firebase Google Auth.
- **Accessibility**: ARIA labels, keyboard navigation, skip links, screen reader support.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Google Cloud Run                │
│  ┌────────────────────────────────────────┐  │
│  │         FastAPI Backend                │  │
│  │  POST /api/plan   POST /api/replan    │  │
│  │         │                │             │  │
│  │    ┌────▼────────────────▼────┐        │  │
│  │    │   Trip Orchestrator      │        │  │
│  │    └────┬───────────┬────────┘        │  │
│  │    ┌────▼───┐  ┌────▼────────┐        │  │
│  │    │Weather │  │  LLM Service│        │  │
│  │    │Open-Met│  │ (Groq/Gemi)│        │  │
│  │    └────────┘  └─────────────┘        │  │
│  ├────────────────────────────────────────┤  │
│  │     React Frontend (Static Build)      │  │
│  │  Landing │ Dashboard │ Firebase Auth   │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Backend | Python + FastAPI | Async API with auto-docs |
| Frontend | React + Vite | Glassmorphism UI |
| AI/LLM | Groq / Google Gemini | Itinerary generation |
| Weather | Open-Meteo API (free) | Real-time forecasts |
| Auth | Firebase Authentication | Google Sign-in |
| Database | Cloud Firestore | Session storage |
| Deployment | Google Cloud Run | Serverless hosting |

## 🔒 Google Services Used

1. **Google Cloud Run** — Serverless deployment
2. **Firebase Authentication** — Google Sign-in
3. **Cloud Firestore** — Data persistence
4. **Firebase Analytics** — Usage tracking
5. **Google Gemini API** — AI itinerary generation (optional, Groq fallback)

## 🚀 Setup & Run

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google Cloud account

### Local Development

```bash
# 1. Install backend dependencies
pip install -r requirements.txt

# 2. Set environment variables
cp .env.example .env
# Edit .env with your API keys

# 3. Run backend
uvicorn main:app --reload --port 8080

# 4. (Separate terminal) Run frontend
cd frontend && npm install && npm run dev
```

### API Examples

```bash
# Health check
curl http://localhost:8080/api/health

# Generate itinerary
curl -X POST http://localhost:8080/api/plan \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Hyderabad, India",
    "start_date": "2026-05-15",
    "end_date": "2026-05-18",
    "budget_level": "moderate",
    "preferences": ["street food", "history", "temples"],
    "traveler_type": "solo",
    "constraints": {
      "max_daily_walking_km": 8,
      "accessibility_needs": false,
      "dietary_restrictions": "vegetarian"
    }
  }'

# Re-plan with disruption
curl -X POST http://localhost:8080/api/replan \
  -H "Content-Type: application/json" \
  -d '{
    "original_destination": "Hyderabad, India",
    "start_date": "2026-05-15",
    "end_date": "2026-05-18",
    "disruption": "Heavy rain expected on Day 2",
    "preferences": ["street food", "history"]
  }'
```

### Cloud Run Deployment

```bash
gcloud run deploy travel-engine \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "GROQ_API_KEY=<key>"
```

## 🧪 Testing

```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_models.py -v
```

## 🔐 Security Measures

- **No hardcoded API keys** — Environment variables / Secret Manager
- **Input sanitization** — XSS prevention, HTML tag stripping
- **Rate limiting** — 15 requests/minute per IP (sliding window)
- **Security headers** — CSP, X-Frame-Options, X-Content-Type-Options
- **Non-root Docker user** — Principle of least privilege
- **CORS configuration** — Controlled cross-origin access

## ♿ Accessibility Features

- Semantic HTML structure with proper heading hierarchy
- ARIA labels on all interactive elements
- Keyboard navigation support
- Skip-to-content link
- `aria-live` regions for dynamic content updates
- `aria-pressed` states on toggle buttons
- High contrast compatible color scheme

## 📁 Project Structure

```
├── main.py              # FastAPI application entry point
├── config.py            # Environment-based configuration
├── models.py            # Pydantic request/response models
├── security.py          # Input sanitization, rate limiting, CSP
├── services/
│   ├── llm_service.py   # AI provider (Groq/Gemini) integration
│   ├── weather_service.py # Open-Meteo weather API
│   └── orchestrator.py  # Service coordination
├── tests/
│   ├── test_models.py   # Model validation tests
│   ├── test_security.py # Security module tests
│   └── test_weather.py  # Weather service tests
├── frontend/            # React + Vite application
│   └── src/
│       ├── pages/       # Landing, Dashboard
│       └── components/  # Navbar, Login
├── Dockerfile           # Multi-stage build (Node + Python)
└── requirements.txt     # Python dependencies
```

## 👥 Team

Built at **PromptWars: Hyderabad** — Google for Developers x Hack2Skill

---

*Powered by Google Cloud, Gemini AI, and ☕*