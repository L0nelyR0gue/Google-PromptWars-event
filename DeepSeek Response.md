Great — you’ve got the problem statement, the rules, and a partner (me). Let’s lock in and win this cash prize. I’ll break down exactly what you need to build, how to ace the evaluation metrics, and even help you draft that social post for max engagement.

## 🎯 Problem Breakdown – Travel Planning & Experience Engine

**Core requirement**:  
> *Plan trips dynamically with preferences, constraints, and real‑time updates*

That means your system should:

1. **Take user inputs** – destination, dates, budget, interests (culture, nature, food, adventure), who’s travelling (solo, family, seniors), mobility constraints, preferred pace.
2. **Respect constraints** – max daily travel time, accommodation type, dietary needs, weather tolerance.
3. **Use real‑time data** – live flight/train prices, weather forecasts, local event availability, opening hours, crowd levels.
4. **Produce a dynamic itinerary** – not a static list. If a flight gets delayed or a museum closes, the plan should adapt.
5. **Be deployed on Cloud Run** – must keep the deployed link **working** (they will DQ if it’s broken).

## 🧠 Winning Architecture – High Score in All Assessment Axes

Here’s a blueprint that touches every evaluation point:

| Evaluation Axis | How we’ll nail it |
|----------------|-------------------|
| **Code Quality** | Use TypeScript (Node) or Python with strict typing, ESLint/Black, modular structure, clear function names, comments only where needed. |
| **Security** | No hardcoded keys – use Secret Manager (Google Cloud). Validate all user inputs, escape outputs, add rate limiting. |
| **Efficiency** | Cache real‑time API responses (e.g. Redis or in‑memory TTL). Use async calls (Promise.all, asyncio). |
| **Testing** | At least 3 unit tests (e.g. preference parser, constraint validator) + 1 integration test for API call. |
| **Accessibility** | If you build a web UI, add ARIA labels, keyboard navigation, high‑contrast mode. Even an API can note accessibility in docs. |
| **Alignment to problem** | Clearly show preferences → constraints → real‑time decision. Provide sample prompts like “Plan a rainy day in Paris with a toddler”. |
| **Google Services usage** | Mandatory to score high – use **Gemini API** (for natural language planning), **Places API** (real‑time POI), **Maps SDK**, and **Cloud Run** (deployment). Bonus: Firestore for user sessions. |

## 🛠 Tech Stack Recommendation (Fast & Powerful)

- **Backend**: Python + FastAPI (async, auto‑docs, easy Cloud Run deployment)  
  OR Node.js + Express (also fine, but Python has better LLM tooling).
- **LLM**: Google Gemini 2.0 Flash (fast, cheap, understands constraints & real‑time data).
- **Real‑time APIs**:
  - Weather: OpenWeatherMap (free tier) or Visual Crossing.
  - Flights/trains: Amadeus or Skyscanner affiliate API (or mock real‑time with cache for demo, but note they want real‑time – so implement at least one live API).
  - Events: Ticketmaster or Eventbrite API.
- **Data storage**: Firestore for saving user sessions / itineraries (Google service).
- **Caching**: Memory cache with expiry (300 seconds) – no extra infra needed.
- **Deployment**: Cloud Run + Cloud Build (upload code from git).

## 📁 Project Structure (to impress assessors)

```
travel-engine/
├── main.py                 # FastAPI app
├── prompts.py              # Gemini prompt templates
├── services/
│   ├── gemini_service.py
│   ├── weather_service.py
│   ├── transport_service.py
│   └── places_service.py
├── models.py               # Pydantic models for request/response
├── constraints/
│   ├── validator.py        # checks preferences vs. real data
│   └── solver.py           # reroutes itinerary when update arrives
├── utils/
│   ├── security.py         # sanitise inputs, rate limiter
│   └── cache.py            # simple TTL cache
├── tests/
│   ├── test_constraints.py
│   └── test_api.py
├── Dockerfile
├── requirements.txt
└── .gcloudignore
```

## 🚀 Step‑by‑Step Build Plan (Do in this order)

### 1. Set up Google Cloud project

- Enable Cloud Run, Secret Manager, Firestore, Maps, Places, Gemini API.
- Create a service account with minimal permissions (no Editor, only needed APIs).

### 2. Build the core planning loop (without real‑time first)

- Create a `/plan` endpoint that accepts:

  ```json
  {
    "destination": "Hyderabad",
    "start_date": "2026-05-15",
    "end_date": "2026-05-18",
    "preferences": ["street food", "history", "walking"],
    "constraints": {"max_budget_usd": 300, "max_daily_km": 8, "wheelchair_accessible": true}
  }
  ```

- Use Gemini with a system prompt like:
  > You are a travel planner. Given destination, dates, preferences, constraints, and real-time weather/event data below, output a day‑by‑day itinerary in JSON. If constraints conflict, suggest compromises.
- Return a tentative itinerary.

### 3. Plug in real‑time APIs

- For weather: call API for each day of trip. If rain >60%, Gemini should recommend indoor activities.
- For transport: use Google Maps Routes API (real‑time traffic & distance) to check daily km constraint.
- For events: fetch local events matching user interests during those dates, insert into itinerary.

### 4. Add dynamic re‑planning endpoint (`/replan`)

- Accept itinerary ID (stored in Firestore) + a trigger like `"flight delayed to 4 PM"` or `"museum closed"`.
- Re‑run Gemini with previous preferences + the new real‑time condition, return updated itinerary.
- This demonstrates “real‑time updates” very explicitly – judges love it.

### 5. Security & efficiency

- Store all API keys in Secret Manager; load at runtime.
- Cache weather for a given city/date for 10 minutes → reduces API calls, faster response.
- Add rate limiting (e.g., 5 requests per minute per IP).

### 6. Testing

- Write test that checks constraint validator rejects a budget of $0.
- Write test that mocks Gemini and verifies itinerary JSON schema.
- Write test that simulates flight delay and checks `/replan` returns different result.

### 7. Deployment (critical – must work)

- Create `Dockerfile` from `python:3.11-slim`.
- Expose port 8080.
- Deploy to Cloud Run with:

  ```bash
  gcloud run deploy travel-engine --source . --region asia-south1 --allow-unauthenticated
  ```

- **Test the URL immediately** – call your `/plan` endpoint. Keep it alive (Cloud Run auto scales down, so set min instances to 0 is fine, but first call may be cold – that’s allowed as long as it eventually works).

### 8. Documentation (part of code quality)

- Add a detailed `README.md` with:
  - Setup instructions (environment variables, APIs to enable)
  - API examples using `curl`
  - Explanation of how you handle constraints & real‑time data
  - Link to live Cloud Run endpoint

## 🏆 Social Media Contest – Win Engagement Prize

Since there’s a separate prize for highest engagement (Likes + Comments + Shares) on a LinkedIn post about your experience, here’s a **viral‑optimised draft**:

> **Post template**  
> 📍 *Hyderabad | #PromptWars @GoogleForDevelopers @hack2skill*  
> 
> 3 hours of sleep + 1 impossible problem = still smiling.  
> 
> Just finished building a *real‑time travel engine* that changes plans while you blink – cancelled flight? Rainstorm? Baby crying? It adapts before you finish your coffee. ☕  
> 
> Key learnings from #BuildWithAI at #PromptWars:  
> • Gemini 2.0 is insanely fast at constraint‑based reasoning  
> • Cloud Run + Secret Manager = security & scale without pain  
> • Real‑time APIs are chaotic but addictive  
> 
> Shoutout to the judges for the brutal DQ rule (working Cloud Run link required – pure stress).  
> 
> Would I do it again? In a heartbeat. Drop a 🔥 if you’ve ever pushed a fix 1 min before deadline.  
> 
> Photo: [your laptop + event badge + whiteboard]  
> Tag: @GoogleForDevelopers @hack2skill  
> Hashtags: #BuildWithAI #PromptWars

**Pro tips for engagement**:

- Post **right after the event ends** (while everyone is still online checking leaderboards).
- Comment on your own post: *“If you want to see the live itinerary generator: [Cloud Run link] – don’t break it, judges 😅”* → drives curiosity clicks → algorithms boost it.
- Reply to every comment within 30 minutes – it doubles the post’s reach.

## ⚠️ Last‑Minute Checklist Before Submission

- [ ] Cloud Run link works – no 500, no timeout (test with `curl -X POST ...`)
- [ ] Code passes automated linting (pylint score >9/10)
- [ ] No API keys in source code
- [ ] At least 2 Google services used (Gemini + Places, or Maps + Firestore)
- [ ] Challenge submission is **only** the final attempt – don’t submit warm‑up tasks
- [ ] Leaderboard shows your score (check after deployment)

You’ve got this. Now go build – and keep me posted on every error. I’ll debug with you in real time. 🧑‍💻
