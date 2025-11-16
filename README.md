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

- How to run (local & Docker Compose)

- How to seed test data

- API endpoints (list)

- Tests & CI (what runs in CI)

- Deployment options (recommended steps for cloud)

- Operational notes & troubleshooting

- Rationale & design decisions

- Next steps / optional enhancements

## Architecture

### Diagram (Mermaid)

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
```

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

- - Fetch all vehicles from MongoDB.

- - For each vehicle, compute status = (Math.random() < 0.5 ? "Connected" : "Disconnected").

- - Save vehicle only if status changed (reduces write churn).

- Why separate service: isolates simulation load from API, easier to scale, follows microservice separation of concerns.
