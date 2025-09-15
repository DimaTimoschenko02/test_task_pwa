# Cloaking MVC Backend (NestJS + TypeORM + MongoDB)

A minimal backend that serves different landings ("black" or "white") depending on traffic filters (OS and optional country). The app follows an MVC-like layout, persists configuration in MongoDB, exposes a small REST API, and ships with Docker Compose.

## Quick start

Prerequisites:

- Docker and Docker Compose

Steps:

1. Optionally adjust environment variables
   - Copy `.env.example` to `.env` and tweak if needed (defaults are fine for Compose):
     - `PORT=3000`
     - `MONGO_URL=mongodb://mongo:27017/test_db`
     - `NODE_ENV=production`
2. Build and run
   - `docker compose build`
   - `docker compose up -d`
3. Verify
   - API docs: http://localhost:3000/docs
   - Health: http://localhost:3000/health
   - Landing (white/black decision): http://localhost:3000/
   - Container logs (seed run on start): `docker logs -f test_task_app`

Notes:

- The Dockerfile runs the seed before starting the app: `npm run seed && node dist/main.js`.
- The seed is idempotent: if an active config already exists, it does nothing.

## How it works (high level)

- On `GET /`, the server evaluates the request OS and country and returns either a "white" or "black" landing (simple HTML templates).
- Each request is logged with basic metadata (ip, country, os, decision, reason, timestamp).
- The active application config (filters and PWA manifest data) is stored in MongoDB and used at runtime.

## About activation and transactions

The `activate` operation is an exclusive activation: it deactivates current active config and activates only the one you target. Conceptually, this should be done in a single transaction, but TypeORM for MongoDB does not provide transactions in this setup (I realized it to late and decided to live it how it is). Given that, the implementation performs two updates:

- `updateOne({active:true}, {$set: {active: false}})`
- `updateOne({_id: <id>}, {$set: {active: true}})`

To keep the state consistent:

- A partial unique index on `{ active: 1 }` with `partialFilterExpression: { active: true }` is created by the seed. This enforces "only one active" at the database level.
- There can be a brief moment with zero active configs between the two updates. For this project’s scope and constraints, this trade‑off is acceptable.

## Why configuration is in the database (not a file)

The original brief suggested a file-based configuration. Since MongoDB was a hard requirement, configuration is modeled as an entity in the database. This way the app demonstrates meaningful MongoDB usage (queries, indexing, constraints) instead of just reading a static file.

## Business rules

- Only one active config is allowed at any time (enforced by a partial unique index and service logic).
- Newly created configs are inactive by default.
- Activation happens via a dedicated endpoint (see API reference below).
- Service prevents deleting or deactivating the last active config through regular update/remove operations.

## API Reference (concise)

Swagger is available at http://localhost:3000/docs and describes DTOs and schemas. Below is a brief map of routes and their purpose.

Health

- `GET /health` — Liveness check (status + timestamp).

Landing

- `GET /` — Decides and returns the HTML of "white" or "black" landing based on filters; logs the request.

App configuration

- `GET /app-config` — List configs (most recently updated first).
- `GET /app-config/active` — Get the active config.
- `GET /app-config/:id` — Get a config by id.
- `POST /app-config` — Create a config (created inactive by default unless explicitly set).
- `PUT /app-config/:id` — Update a config; attempting to set active=true will fail if another active exists.
- `DELETE /app-config/:id` — Delete a config; deleting the last active is forbidden.
- `PATCH /app-config/activate/:id` — Exclusively activate this config (all others become inactive). Intended to be transactional, but implemented as two updates due to TypeORM + MongoDB limitations (see above).

Logs

- `GET /logs` — Fetch logs with filters and pagination.
  - Query params: `ip`, `country` (ISO uppercase), `os` (lowercase), `passed` (boolean), `from`, `to` (ISO datetimes), `page` (>=1), `limit` (>=1, up to 100), `order` (`asc|desc`).

## Local development (optional)

If you prefer running without Docker:

- Requirements: Node.js 20+, MongoDB running locally.
- Steps:
  - `npm install`
  - Set `MONGO_URL` in `.env` (e.g., `mongodb://localhost:27017/test_db`)
  - `npm run build`
  - `npm run seed`
  - `npm start`

Tooling:

- ESLint + Prettier are configured; Husky runs lint-staged on pre-commit.

## License

MIT
