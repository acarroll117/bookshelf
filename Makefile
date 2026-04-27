install:
	python3 -m venv backend/.venv
	cd backend && source .venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install

dev-backend:
	cd backend && source .venv/bin/activate && uvicorn main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev
