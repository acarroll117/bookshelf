help:
	@echo "Setup"
	@echo "  init          Install app dependencies and create the dev database (run this first)"
	@echo "  install       Install Python and Node dependencies"
	@echo "  setup-db      Create the dev database and copy backend .env"
	@echo "  install-tests Install Playwright, create the test database, and copy test .env"
	@echo ""
	@echo "Development"
	@echo "  dev-backend   Start the API server (http://localhost:8000/docs)"
	@echo "  dev-frontend  Start the frontend (http://localhost:5173)"
	@echo ""
	@echo "Testing"
	@echo "  test          Run all tests (backend on :8001, frontend on :5174, bookshelf_test db)"
	@echo "  test-api      Run API tests only"
	@echo "  test-ui       Run UI tests only"

install:
	python3 -m venv backend/.venv
	cd backend && source .venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install

install-tests:
	createdb bookshelf_test 2>/dev/null || true
	cp -n tests/.env.test.example tests/.env.test 2>/dev/null || true
	cd tests && npm install && npx playwright install chromium

setup-db:
	createdb bookshelf_dev 2>/dev/null || true
	cp -n backend/.env.example backend/.env 2>/dev/null || true

init: install setup-db

dev-backend:
	cd backend && source .venv/bin/activate && uvicorn main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

test:
	cd tests && npx playwright test

test-api:
	cd tests && npx playwright test --project=api

test-ui:
	cd tests && npx playwright test --project=ui
