# Vehicle-Simulation

## Overview

This project is a small microservices system that simulates connected vehicles and shows their connection status on a single-page web dashboard.

Problem: monitor connection status (Connected / Disconnected) of vehicles that report once per minute.

Goal: provide a datastore holding customers and vehicles + a SPA dashboard with filters (by customer & status).

Approach: Node.js + Express backend, React frontend, MongoDB, a separate Simulation microservice, Dockerized and CI tested.

## Contents

- Architecture (diagram + explanation)

- Data model

- Simulation design (how it simulates vehicle pings)

- How to run (Docker Compose)

- API endpoints (list)

- Tests

- CI/CD Pipeline (GitHub Actions)

## Architecture

### Diagram (Mermaid)

````mermaid
flowchart LR
  subgraph USER
    Browser[Browser]
  end

  subgraph SERVICES
    FE[Frontend React]
    API[Backend API Express]
    SIM[Simulation Service Node/Express]
  end

  subgraph DATA
    MONGO[MongoDB]
  end

  Browser -->|REST / Fetch| FE
  FE -->|REST / HTTP| API
  API -->|read/write| MONGO
  SIM -->|writes status updates| MONGO
  FE -.polls or websocket.-> API


### High-level explanation

- Frontend (React) fetches `customers` and `vehicles` from the backend API and renders a full-screen dashboard with filters. It polls the requests data on filter changes.

- Backend API (Express) exposes REST endpoints for `customers` and `vehicles` and returns data for the frontend.

- Simulation Service (separate Node process) connects to the same MongoDB instance and updates each vehicle’s status field on a regular interval (default: 60s) to simulate pings.

- MongoDB stores customers and vehicles in separate collections. Each customer contains an array of vehicle IDs, forming a one-to-many relationship where a customer can have multiple vehicles.

This separation follows a simple microservices style: each service is separate and can be deployed independently, and they communicate using the same database.

## Data model

### `Vehicle` (collection vehicles)

```json
{
  "_id": "...",
  "vin": "YS2R4X20005399401",
  "regNr": "ABC123",
  "status": "Connected" // or "Disconnected"
}
````

### `Customer` (collection customers)

```json
{
  "_id": "...",
  "name": "Kalles Grustransporter AB",
  "address": "Cementvägen 8, 111 11 Södertälje",
  "vehicles": ["vehicleId1", "vehicleId2"]
}
```

## Simulation design (how pings are simulated)

- Service: `simulationService` (separate process/container).

- Logic(runs every 1 minute):

  - Fetch all vehicles from MongoDB.

  - For each vehicle, compute status = (Math.random() < 0.5 ? "Connected" : "Disconnected").

  - Save vehicle only if status changed (reduces write churn).

- Why separate service: isolates simulation load from API, easier to scale, follows microservice separation of concerns.

## How to run

### Prereqs

- Docker & Docker Compose

- Node >= 20 (if running services locally without Docker)

- MongoDB (local or hosted) if not using the provided Mongo container

### Run with Docker Compose

From project root (where docker-compose.yml lives):

```bash
# build & start all containers
docker-compose up --build -d

```

Services (default ports):

- Frontend: http://localhost:5173

- Backend API: http://localhost:5000/api/v1

- Simulation: runs internally and writes to MongoDB

- MongoDB: mongodb://mongodb:27017 (container network)

## API endpoints

- Base: `/api/v1`

- `GET /customers` — list customers (with vehicles optionally populated)

- `GET /customers/:id` — get customer by id (populated vehicles)

- `GET /vehicles` — list vehicles (supports query params)

  - query params: `customerId`, `status` (Connected/Disconnected)

## Tests

### Tests included

- Unit tests (backend models/controllers, frontend components) — Jest + React Testing Library.

- Integration tests — API + DB (supertest + in-memory Mongo).

### Run tests locally

From repo root:

```bash
# backend
cd backend
npm test
# frontend
cd ../frontend
npm test
# simulateVehicle
cd ../simulateVehicle
npm test
```

## CI/CD Pipeline (GitHub Actions)

This project uses GitHub Actions to automate testing, building, and deployment of all services: backend, frontend, and simulation.
The pipeline ensures code quality, reliable tests, and automated Docker image publishing.

### Workflow Overview

The pipeline is triggered on:

- Push to the main branch

- Pull request targeting the main branch

It consists of two main jobs:

### 1️⃣ Build and Test

1. Runs in parallel for each service (backend, frontend, simulateVehicle):

2. Checkout code – fetches the repository.

3. Set up Node.js – Node.js v20 environment.

4. Install dependencies – runs npm install for each service.

5. Run tests – executes unit and integration tests for each service (npm test).

### 2️⃣ Docker Build and Push

Runs on push events only:

1. Checkout code – fetches the repository.

2. Check Docker setup – ensures Docker and Docker Compose are installed.

3. Login to Docker Hub – securely uses GitHub secrets (DOCKERHUB_USERNAME, DOCKERHUB_PASSWORD).

4. Build Docker images – builds each service (backend, frontend, simulation) using Docker Compose.

5. Push Docker images – uploads images to Docker Hub.
