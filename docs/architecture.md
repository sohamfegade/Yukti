# Architecture Guide

## Overview
Yukti is structured as a clean monorepo with distinct separation of concerns between the frontend (presentation and 3D visualization) and backend (API, algorithms, database).

## Frontend Architecture
- **Framework**: React with TypeScript and Vite.
- **Routing**: React Router for single-page application navigation.
- **Styling**: Tailwind CSS for utility-first styling and a consistent design system.
- **3D Visualization**: Three.js integrated via React Three Fiber (R3F) and @react-three/drei.
  - `SceneWrapper`: Reusable canvas wrapper for all 3D scenes.
  - `BackgroundNodes`: Decorative 3D elements for the landing page.

## Backend Architecture
- **Framework**: FastAPI for high-performance async API routes.
- **Database**: SQLite with SQLAlchemy ORM.
- **Directory Structure**:
  - `database/`: Connection and ORM setup.
  - `models/`: Database tables (e.g., `ExperimentHistory`).
  - `schemas/`: Pydantic models for request/response validation.
  - `routers/`: API endpoints grouped by domain (search, game, bayesian, history).
  - `services/`: Business logic.
  - `algorithms/`: Core AI algorithm implementations (Phase 2).
