dev-backend:
	cd backend && source .venv/bin/activate && uvicorn main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev
