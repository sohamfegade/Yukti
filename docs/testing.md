# Testing Guide

## Backend Testing
Backend tests are written using `pytest` and `TestClient` from FastAPI.

### Running Backend Tests
1. `cd backend`
2. Activate your virtual environment
3. Run tests with: `set PYTHONPATH=. && pytest`

## Frontend Testing
Frontend testing infrastructure is set up with `vitest`.

### Running Frontend Tests
1. `cd frontend`
2. Run tests with: `npm run test`

## Manual QA Verification
Before merging PRs, perform these manual tests:
1. Load `http://localhost:5173/` - check if the Landing page and 3D background load.
2. Navigate to Dashboard - verify layout.
3. Check Search, Game, and Probabilistic Lab pages.
4. Verify backend health endpoint `http://localhost:8000/api/health`.
