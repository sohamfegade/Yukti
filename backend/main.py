from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
from routers import health, search, game, bayesian, history

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Yukti AI",
    description="Interactive AI Decision & Visualization Lab API",
    version="0.1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(game.router, prefix="/api")
app.include_router(bayesian.router, prefix="/api")
app.include_router(history.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
