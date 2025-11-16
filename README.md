# Vehicle-Simulation

## Overview

This project is a small microservices system that simulates connected vehicles and shows their connection status on a single-page web dashboard.

Problem: monitor connection status (Connected / Disconnected) of vehicles that report once per minute.

Goal: provide a datastore holding customers and vehicles + a SPA dashboard with filters (by customer & status).

Approach: Node.js + Express backend, React frontend, MongoDB, a separate Simulation microservice, Dockerized and CI tested.

## Contents

Architecture (diagram + explanation)

Data model

Simulation design (how it simulates vehicle pings)

How to run (local & Docker Compose)

How to seed test data

API endpoints (list)

Tests & CI (what runs in CI)

Deployment options (recommended steps for cloud)

Operational notes & troubleshooting

Rationale & design decisions

Next steps / optional enhancements
