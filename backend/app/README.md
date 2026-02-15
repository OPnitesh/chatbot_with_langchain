## AWS Chatbot Backend (FastAPI + LangGraph)

This backend powers an AWS-focused assistant with:
- AWS-only guardrails
- Streaming chat responses (SSE)
- Session-based PostgreSQL conversation persistence

## Recommended API
Use streaming:
- `POST /chat/stream`

## Request Contract
`POST /chat/stream` accepts:

```json
{
  "message": "Explain AWS load balancers",
  "session_id": "user-session-1"
}
```

## Streaming Response Format (`/chat/stream`)
SSE events are sent as:
- `{"type":"token","content":"..."}`
- `{"type":"end","content":"..."}`
- `{"type":"error","content":"..."}`

## Run (Development)
From `backend/`:

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

If reload is unstable on Windows/mapped drives:

```bash
set WATCHFILES_FORCE_POLLING=true
python -m uvicorn app.main:app --reload --reload-dir app --host 0.0.0.0 --port 8000
```

## Run With Docker + PostgreSQL
From `backend/app`:

```bash
docker compose up --build
```

This starts:
- API on `http://localhost:8000`
- PostgreSQL on `localhost:5432`

## Health Check
`GET /health` returns:

```json
{"status":"healthy"}
```

## Backend File Responsibilities
- `app/main.py`: app entrypoint, CORS, router mounting
- `app/api/chat.py`: HTTP routes + request/response schemas
- `app/services/chat_service.py`: core chat logic + streaming orchestration + session memory
- `app/core/db.py`: SQLAlchemy engine/session initialization
- `app/core/db_models.py`: database schema (`chat_messages`)
- `app/llm/agent.py`: LLM + prompt chain construction/caching
- `app/llm/graph.py`: LangGraph flow node setup
- `app/llm/state.py`: state typing contract
- `app/llm/guard.py`: AWS-scope policy enforcement
- `app/llm/system_prompt.txt`: system behavior/prompt policy

## Best Practices Used
- Keep route handlers thin; business logic in service layer
- Use SSE for real-time UI feedback
- Validate request payloads with Pydantic
- Enforce scope with guard checks before/after generation
- Cache expensive LLM/chain construction
- Keep prompt policy in a separate text file

## Production Notes
- Session data is persisted in PostgreSQL
- Restrict CORS to known frontend origins in production
- Add auth, rate limiting, and observability before public deployment


