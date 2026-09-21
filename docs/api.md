# API Documentation

The backend API is built with FastAPI and runs on `http://localhost:8000/api` by default.

## Endpoints

### Health Check
- `GET /api/health`
- **Response**: `{"status": "ok", "message": "Yukti API is running"}`

### Search Intelligence
- `POST /api/search/run`
- Runs a pathfinding or search algorithm. (Placeholder)

### Game Intelligence
- `POST /api/game/run`
- Runs an adversarial search algorithm. (Placeholder)

### Probabilistic Intelligence
- `POST /api/bayesian/run`
- Runs a probabilistic inference or MDP algorithm. (Placeholder)

### History
- `GET /api/history/`
- Retrieves the history of all executed experiments.
- `POST /api/history/`
- Records a new experiment execution.
