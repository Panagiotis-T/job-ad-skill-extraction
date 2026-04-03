# Frontend (Next.js + TypeScript)

Minimal UI for the Job Ad Skill Extraction project.

## Prerequisites

- Node.js 20+
- Python backend running at `http://localhost:8000`

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

3. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What this frontend uses

- `GET /health`
- `GET /skills`
- `GET /ads?limit=5`
- `GET /ads/{id}`

## Main files

- `src/app/page.tsx` - dashboard page
- `src/app/ads/[id]/page.tsx` - ad details page
