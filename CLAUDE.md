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
