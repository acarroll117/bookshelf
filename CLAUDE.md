# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Full-stack bookshelf app: a **FastAPI** backend backed by **PostgreSQL**, and a **React + TypeScript + Tailwind** frontend built with Vite.

### Backend (`backend/`)

- `database.py` — SQLAlchemy engine/session wiring; reads `DATABASE_URL` from env via `python-dotenv`
- `models.py` — SQLAlchemy ORM model (`Book` table with UUID PK, title, author, review, score, timestamps)
- `schemas.py` — Pydantic schemas (`BookCreate`, `BookUpdate`, `BookOut`); score is validated to 1–10
- `main.py` — FastAPI app; full CRUD on `/books`; tables are **not** created automatically — they must exist in the DB

There is no migration tool (e.g. Alembic). Schema changes must be applied manually to the database.

### Frontend (`src/`)

- `types/book.ts` — TypeScript interfaces (`Book`, `BookPayload`)
- `api/books.ts` — thin `fetch`-based API client; all calls go to `/api/books` (proxied by Vite)
- `components/` — `BookList`, `BookCard`, `BookForm`
- `App.tsx` — root component; owns all state (book list, editing state, form visibility)

Vite dev server proxies `/api → http://localhost:8000` (stripping the `/api` prefix), so the backend must be running on port 8000 during development.

## Development Commands

### Backend

```bash
cd backend
cp .env.example .env          # set DATABASE_URL
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload     # runs on http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev     # runs on http://localhost:5173
npm run build   # type-check + production build
```

## Environment

Backend requires a `.env` file in `backend/` with:

```
DATABASE_URL=postgresql://user:password@host:5432/postgres
```

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.
