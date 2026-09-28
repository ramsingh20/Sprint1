# PulseBoard Backend

Express API for PulseBoard. Existing authentication, JWT/session validation, route permissions, and API routes remain responsible for authentication and authorization.

## Local setup

1. Install Node.js and MongoDB, or provide a MongoDB connection URI.
2. Copy `.env.example` to `.env` and set `MONGO_URI` and a private random `JWT_SECRET` of at least 32 characters. Keep `.env` out of source control.
3. Run `npm install`, then `npm run dev`. The API listens on port 3000 by default; set `PORT` to override it.
4. Start the frontend from `../PulseBoard` using `npm run dev`. Its default API URL is `http://localhost:3000/api`.

`npm start` runs without watch mode. Startup validates required configuration and waits for MongoDB before accepting requests. `GET /api/health` reports database readiness.

## Production configuration

Set `NODE_ENV=production`, `MONGO_URI`, a strong private `JWT_SECRET` (at least 32 characters), `PORT`, and `CORS_ORIGINS` as a comma-separated list of exact frontend origins, including scheme and port where applicable. Production startup fails if the origin list is empty. Configure TLS at the hosting platform or reverse proxy, restrict database network access, and store credentials in the platform's secret manager.

Set frontend `VITE_API_URL` to the public backend API URL including `/api`, or `/api` when a same-origin reverse proxy forwards API requests. Set `VITE_BASE_PATH=/` for a root domain; the existing `/Sprint1/` default preserves the current GitHub Pages path. Frontend `VITE_` values are public and must never contain secrets.

## Verification

Run `npm run lint` and `npm run build` in `../PulseBoard`. The backend currently has no automated test suite configured; `npm test` is a placeholder. Verify startup with production configuration and check `/api/health` after MongoDB connects before deployment.