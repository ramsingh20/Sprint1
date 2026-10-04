# PulseBoard Backend

The backend is the Express and MongoDB API for PulseBoard. It serves REST endpoints and the authenticated Socket.IO channel from the same HTTP server.

## Architecture

- Node.js and Express provide the REST API; Mongoose connects to MongoDB.
- `middleware/authMiddleware.js` verifies JWTs and their server-side sessions. `middleware/roleMiddleware.js` enforces role access on protected APIs.
- Passwords are hashed with bcryptjs.
- Socket.IO is initialized alongside Express in `server.js`. Its handshake validates the same JWT and the corresponding server-side session; it does not issue or store a second token.
- Orders and customer aggregates are persisted in MongoDB. Customer records use the existing user data model; order counts, spend, and history are derived from related orders.

## Backend setup

Requirements: Node.js supported by the installed dependencies, npm, and MongoDB or a reachable MongoDB connection URI.

From this directory:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

For a non-watch start, run `npm start`. The API waits for MongoDB before listening. The default port is `3000`.

## Environment and configuration

Set these values in `PulseBoardBackend/.env`:

```dotenv
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/pulseboard
JWT_SECRET=replace-with-a-private-random-secret-at-least-32-characters
CORS_ORIGINS=http://localhost:5173
```

`MONGO_URI` and `JWT_SECRET` are required. Use a private random JWT secret of at least 32 characters in production and keep `.env` out of source control. `CORS_ORIGINS` is a comma-separated allowlist of exact frontend origins. Development defaults to `http://localhost:5173`; production requires an explicit allowlist. Configure TLS at the hosting platform or reverse proxy.

`GET /api/health` returns 200 with `{ "status": "ok" }` when MongoDB is connected, otherwise 503 with `{ "status": "unavailable" }`.

## Authentication and sessions

`POST /api/auth/register` validates inputs, hashes the password, creates a server-side session, and returns a JWT. `POST /api/auth/login` rejects invalid or inactive accounts and returns the same JWT format. Tokens contain `id`, `role`, and `sid` claims and expire after 30 minutes. A corresponding session with a 30-minute expiry is stored on the user record.

Protected REST requests must include `Authorization: Bearer <token>`. The middleware verifies the token, checks that its role still matches the current account, rejects inactive accounts, and requires the matching session ID. It updates `lastActiveAt` at most once every five minutes; this does not extend the fixed expiry. Logout and session-revocation endpoints remove server-side sessions and disconnect matching sockets. Password changes keep the current session and revoke other sessions/sockets. Changing a user role or deactivating an account revokes all of that user's sessions and disconnects their sockets. Socket.IO requires the existing token in `handshake.auth.token`, verifies the JWT, current account role/status, and matching unexpired session, and attaches `{ id, role, sid }` to the socket. Tokens and session IDs are not logged. Socket events do not renew sessions.

## Roles and authorization

| Role | API access |
| --- | --- |
| Admin | All authenticated business APIs; can delete users |
| Manager | Analytics, Reports, Users (except deletion), Orders, Customers, Settings, and Profile |
| User | Dashboard and self-service Profile/authentication APIs |

Analytics, Reports, Users, Orders, and Customers APIs require Admin or Manager. User deletion requires Admin. Dashboard endpoints are available to all authenticated roles. Profile, preferences, sessions, and password changes operate on the authenticated user's own account/session.

## API routes

All paths below are prefixed with `/api`.

| Area | Endpoints | Access |
| --- | --- | --- |
| Health | `GET /health` | Public readiness check |
| Authentication | `POST /auth/register`, `POST /auth/login` | Public |
| Current user/settings | `GET /auth/me`, `PATCH /auth/me` | Authenticated; own account |
| Password/sessions | `PATCH /auth/change-password`, `GET /auth/sessions`, `DELETE /auth/sessions/:sid`, `DELETE /auth/sessions/others`, `POST /auth/logout` | Authenticated; own account/session |
| Dashboard | `GET /dashboard/stats`, `/revenue`, `/user-growth`, `/activity` | Any authenticated role |
| Analytics | `GET /analytics/stats`, `/revenue`, `/user-acquisition`, `/traffic-sources` | Admin or Manager |
| Reports | `GET /reports/stats`, `/revenue`, `/table` | Admin or Manager |
| Users | `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `PATCH /users/:id/status`, `DELETE /users/:id` | Admin or Manager; delete is Admin-only |
| Orders | `POST /orders`, `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id/status` | Admin or Manager |
| Customers | `GET /customers`, `GET /customers/:id`, `PATCH /customers/:id/status` | Admin or Manager |

List endpoints support their documented search, filter, and pagination query parameters. Controllers validate request data and return JSON responses with pagination metadata where relevant.

## Real-time events

The Socket.IO server shares the backend HTTP server and requires the REST JWT plus a valid server-side session. After successful database operations, the order controller emits:

- `order:created` with the created order object (including populated customer name and email).
- `order:status-updated` with the updated order object (including populated customer name and email).

The frontend treats REST responses as authoritative and refetches dashboard, order, and customer data after relevant events. Socket.IO's built-in reconnection is enabled on the client. No customer-specific events or fake events are emitted. Events are broadcast to authenticated socket connections to support dashboard updates; REST routes remain role-authorized. Event delivery does not provide separate per-event role filtering.

## Commands and verification

```powershell
npm run dev
npm start
npm test
```

The backend currently has no automated test suite; `npm test` is a placeholder and exits with an error. Verify startup by checking the listening message and request `GET /api/health` after MongoDB connects. Run frontend checks from `../Frontend` with `npm run lint` and `npm run build`.

## Known limitations

- Two-factor authentication is not implemented; the frontend toggle is local UI state.
- Real-time event coverage is limited to order creation and status changes. Customer aggregates refresh from those order events; there is no customer-specific event.
- API-driven logout, session revocation, password changes, role changes, and deactivation disconnect affected sockets. Direct database edits to sessions are not pushed to connected sockets until they reconnect; Socket.IO does not periodically revalidate sessions.
- Socket order events are broadcast to authenticated connections rather than filtered into role-specific rooms. They support data also represented by the authenticated Dashboard activity API; use event-level authorization if future events expose data outside that audience.
- Traffic-source summaries use the stored user `source` field, not browser tracking or independently verified marketing attribution.