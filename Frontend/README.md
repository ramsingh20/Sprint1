# PulseBoard Frontend

The frontend is the React single-page application for the PulseBoard business management and analytics dashboard. It runs separately from the Express API in `../PulseBoardBackend`.

## Architecture

- React 19, Vite, React Router, and Redux Toolkit provide the application shell, navigation, and client state.
- Tailwind CSS, shadcn/ui, and Material Tailwind provide the interface components.
- API calls use native `fetch()` through `src/services/api.js`. The service sends the current JWT as a Bearer token when one is present and clears authentication state for recognized 401 responses.
- `src/services/socketService.js` owns one shared Socket.IO client. It reads the current JWT when connecting and uses Socket.IO's automatic reconnection.
- The API is the source of truth for dashboard, order, and customer data. Socket events cause the relevant pages to refetch through their existing REST services.

## Features

- Dashboard KPIs, revenue, customer/user growth, date ranges, and recent activity use backend data.
- Analytics provides statistics, revenue, acquisition, and stored-source summaries.
- Reports provides statistics, revenue, a searchable/paginated report table, and CSV export.
- Users supports search, role/status filters, sorting, pagination, details, edits, status changes, and deletion according to role.
- Orders supports creation through the API, search, status filtering, pagination, details, and status changes.
- Customers supports search, status filtering, pagination, details, customer status changes, and order history. Customer records and order-derived totals are backed by the existing user/customer data model.
- Settings persist general workspace values, appearance, notification preferences, and security/session operations supported by the API.
- Profile and protected dashboard routes require authentication.

## Roles and access

| Role | Frontend access |
| --- | --- |
| Admin | Dashboard, Analytics, Reports, Users, Orders, Customers, Settings, and Profile |
| Manager | Dashboard, Analytics, Reports, Orders, Customers, Settings, and Profile |
| User | Dashboard and Profile |

The backend enforces authorization as well as the frontend route guards. Admin and Manager access is required for Analytics, Reports, Users, Orders, and Customers APIs; deleting users is Admin-only. Dashboard endpoints and self-service authentication/profile endpoints are available to any authenticated role.

## Authentication and sessions

Login and registration receive the existing JWT and store it in `localStorage` under `token`. The JWT carries the user ID, role, and session ID (`sid`) and expires after 30 minutes. Protected REST requests send that JWT in the Authorization header. The backend verifies the JWT, checks the current account role/status, and requires the matching server-side session. Logout and session revocation disconnect the matching socket. Role changes and account deactivation revoke the affected user's sessions and sockets; users sign in again to receive a token for a new role. Password changes keep the current session and revoke other sessions. Sessions are not renewed by socket events; users may need to sign in again after expiry.

## Real-time updates

The shared Socket.IO connection sends the current JWT in `handshake.auth.token`. The backend verifies the same JWT and validates its server-side session. The existing events are:

- `order:created`
- `order:status-updated`

Dashboard, Orders, and Customers pages subscribe while mounted and remove their listeners when unmounted. They ignore socket payloads for UI calculations and refetch relevant REST data. Customer lists and open customer details refresh on order events because their totals and history depend on orders. There is no customer-specific socket event. Socket events are broadcast to authenticated socket connections; role-restricted pages and REST APIs still enforce their role checks.

## Local setup

Requirements: Node.js compatible with the installed Vite 8 release, npm, and a running PulseBoard backend with MongoDB configured.

From this directory:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Open the Vite URL and use the configured base path, `/Sprint1/` by default. Start the backend separately from `../PulseBoardBackend`.

## Frontend configuration

Set these values in `Frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:3000/api
VITE_BASE_PATH=/Sprint1/
```

`VITE_API_URL` must include `/api`; use `/api` when a same-origin reverse proxy forwards requests. `VITE_BASE_PATH` defaults to `/Sprint1/` for the current GitHub Pages path and can be `/` for a root-domain deployment. Vite variables are embedded in the client bundle; never put secrets in `VITE_*` values.

## Commands

```powershell
npm run dev
npm run lint
npm run build
npm run preview
```

`npm run lint` checks the full frontend. Existing project lint findings may need separate cleanup; use ESLint on specific files for a targeted check. `npm run build` creates the production bundle in `dist/`.

## Known limitations

- The Security Settings two-factor toggle is local UI state; two-factor authentication is not implemented.
- Real-time events currently cover order creation and order status changes only. Customer changes have no customer-specific event.
- Traffic-source reporting uses the stored user `source` field; it is not browser tracking or independently verified marketing attribution.
- Backend automated tests are not configured yet. The backend `npm test` command is a placeholder.
- Full-project ESLint currently reports existing errors in unrelated components. These are not fixed as part of this release-readiness pass.




Ek line mein interviewer ko kya bolna hai?

"PulseBoard is a business management and analytics dashboard where admins can manage users and monitor important business information such as customers, orders, revenue, analytics, and reports from a single platform."

Aur agar interviewer bole "Iska real-world use kya hai?"

Aap bol sakte ho:
"For example, an e-commerce company can use PulseBoard internally to monitor its business performance, manage users, track orders and revenue, and generate reports for decision-making."


Maan lo ek company online business / e-commerce business chala rahi hai. Us company ke paas bahut saara data hai:

Kitne customers hain?
Kitne orders aaye?
Kitni sales/revenue hui?
Kaunse users active hain?
New customers kitne aaye?
Customers kahan se aa rahe hain?
Business ki performance kaisi chal rahi hai?

PulseBoard ye saari information ek hi jagah par dikhata hai.

Example

Company ka Admin PulseBoard mein login karta hai.

Usko Dashboard par dikhta hai:

Revenue: $50,000
Orders: 1,250
Customers: 850

Phir Admin Users section mein jaakar dekh sakta hai:

John — Active — User
Rahul — Inactive — User
Priya — Active — Manager

Admin zarurat padne par user ko:

Edit
Delete
Activate
Deactivate

kar sakta hai.

Analytics mein

Admin dekh sakta hai:

📈 Revenue kaise grow ho raha hai
👥 New customers kitne aa rahe hain
🌐 Customers Google, Facebook, Instagram etc. se kitne aa rahe hain

Reports mein

Admin detailed business report dekh sakta hai:

Date → Orders → Revenue → Customers → Average Order

Aur report ko CSV file mein export bhi kar sakta hai