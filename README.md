# Yukti - AI Decision & Visualization Lab

"See AI Think. Trace Every Decision. Understand the Intelligence."

Yukti is a professional AI education and visualization platform that allows users to interactively explore how AI algorithms search, reason, evaluate, and make decisions. 

## Features
- **Search Intelligence Lab**: Explore pathfinding and uninformed/informed search algorithms like BFS, DFS, and A*.
- **Game Intelligence Lab**: Analyze adversarial search algorithms like Minimax and Alpha-Beta pruning.
- **Probabilistic Intelligence Lab**: Understand decision making under uncertainty with Bayesian Networks and MDPs.
- **Interactive 3D Visualizations**: Real-time visualization of algorithm execution using Three.js and React Three Fiber.
- **Experiment History**: Track, compare, and analyze the results of algorithm runs.

## Architecture
The project is built as a clean monorepo:
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Three.js, React Three Fiber.
- **Backend**: Python, FastAPI, SQLAlchemy, SQLite.
- **Documentation**: Extensive Markdown documentation in the `docs/` directory.

See [Architecture Guide](docs/architecture.md) for more details.

## Development Setup

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend
1. `cd backend`
2. `python -m venv venv`
3. Activate venv (`.\venv\Scripts\Activate.ps1` or `source venv/bin/activate`)
4. `pip install -r requirements.txt` (or install FastAPI, Uvicorn, SQLAlchemy, pytest directly)
5. `uvicorn main:app --reload`

## Testing
- **Backend**: `cd backend && pytest`
- **Frontend**: `cd frontend && npm run test`

See [Testing Guide](docs/testing.md) for detailed test plans and manual verification steps.
