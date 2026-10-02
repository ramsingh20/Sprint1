# PulseBoard — AGENTS.md

## Project Goal

PulseBoard is an industry-level full-stack business management and analytics dashboard.

It is intended to demonstrate a realistic internal platform for an e-commerce/business organization where authorized users can manage customers/users/orders and monitor revenue, analytics, and reports.

Frontend:
- React 19
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS
- shadcn/ui
- Material Tailwind
- Native `fetch()` for API calls

Backend:
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt

Project layout:

- `Frontend/` — React/Vite application
- `PulseBoardBackend/` — Express/Mongoose API

## Important Development Rules

1. Inspect existing code before changing it.
2. Preserve working functionality.
3. Do not rewrite unrelated features.
4. Reuse existing services, controllers, routes, middleware, and components where appropriate.
5. Do not create duplicate APIs.
6. Keep frontend and backend contracts consistent.
7. Use native `fetch()` for frontend API communication. Do not introduce Axios for new code.
8. Do not expose secrets in frontend code or `VITE_*` variables.
9. Never return passwords or password hashes from APIs.
10. Respect authentication and role-based authorization.
11. Validate user input on both client and server where appropriate.
12. Handle loading, empty, error, and success states for user-facing async operations.

## Definition of Done

A feature is not considered complete merely because a UI exists.

For a feature that requires backend functionality, aim for:

UI
-> API
-> Database
-> Authentication
-> Authorization
-> Validation
-> Error handling
-> Loading/empty states

## Already Implemented

### Authentication
- Registration
- Login
- Logout
- JWT authentication
- Protected routes
- `/api/auth/me`
- Password change
- Session listing
- Revoke individual session
- Revoke other sessions
- Session-aware JWT validation
- Inactive account protection

### Authorization
- Admin / Manager / User roles
- Protected frontend routes
- Role-protected frontend routes
- Protected backend APIs

### Dashboard
- Real MongoDB KPI data
- Revenue chart
- User/customer growth data
- Recent activity
- Period filtering
- Loading/error/empty states

### Analytics
- KPI statistics
- Revenue analytics
- User acquisition
- Traffic sources
- Period filtering
- Real MongoDB data

### Users
- User list
- Search
- Role/status filtering
- Sorting
- Pagination
- View details
- Edit
- Delete
- Activate/deactivate

### Orders
- Order list
- Search
- Status filtering
- Pagination
- Order details
- Status update
- Real MongoDB data
- RBAC

### Customers
- Customer list
- Search
- Status filtering
- Pagination
- Customer details
- Order history
- Customer status update
- Real MongoDB data
- RBAC

### Reports
- KPI statistics
- Revenue chart
- Daily report table
- Period filtering
- Search
- Pagination
- CSV export
- Real MongoDB data

### Settings
- General settings persistence
- Workspace name
- Description
- Language
- Timezone
- Appearance preference persistence
- Light/dark/system theme
- Notification preferences persistence
- Change password
- Active session management

## Remaining Work

### Priority  — Real-time analytics / live updates

The project name/goal includes an Enterprise Real-Time Analytics Dashboard, but the current codebase does not contain a WebSocket, Socket.IO, SSE, or polling implementation.

Before declaring the project fully complete, evaluate and implement a suitable real-time mechanism.

Expected direction:
- choose WebSocket/Socket.IO/SSE based on the existing architecture
- update dashboard/analytics data when relevant backend data changes
- avoid unnecessary full-page reloads
- keep authentication/security in the real-time channel
- handle reconnect/disconnect states

Do not invent fake real-time updates.

### Priority  — Final code quality

After feature work:
- remove unused dependencies
- remove obsolete temporary/test routes
- update README documentation

### Priority — Final end-to-end testing

Test as:
1. Admin
2. Manager
3. User

Verify:
- login/logout
- protected routes
- role restrictions
- dashboard
- analytics
- users
- customers
- orders
- reports
- settings
- profile
- password change
- session management
- error states
- responsive UI

## Important Current Findings

The current project already contains Orders and Customers modules.

The current traffic-source analytics is based on the user's stored `source` field. Do not describe it as browser/marketing attribution beyond what the database actually records.

The current Settings model contains both `weeklyReport` and `weeklyReports` notification fields. Avoid introducing new duplicate preference names. Prefer the existing frontend/backend contract (`weeklyReports`) and clean up the unused duplicate during final cleanup if safe.

The current Security Settings 2FA toggle is only local UI state. Treat 2FA as incomplete.

## Workflow

For every new phase:

1. Inspect the relevant existing implementation.
2. State the files/components/API contracts that will change.
3. Implement only the requested phase.
6. Report:
   - files changed
   - tests/commands run
   - results
   - remaining issues

Do not silently make unrelated architectural changes.
