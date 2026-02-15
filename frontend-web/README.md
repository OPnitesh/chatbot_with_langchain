# Assistant UI Chat Clone

React frontend that uses `@assistant-ui` primitives with a custom streaming runtime adapter connected to the FastAPI endpoint:

- `POST /chat/stream` (Server-Sent Events)

## Run

1. Install dependencies:

```bash
npm install
```

2. Configure backend URL:

```bash
cp .env.example .env
```

3. Start frontend:

```bash
npm run dev
```

## Environment

- `VITE_API_BASE_URL`: FastAPI base URL (default `http://localhost:8000`)
