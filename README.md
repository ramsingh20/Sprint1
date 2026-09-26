## Local development configuration

Copy `.env.example` to `.env` and set the frontend values for your environment. `VITE_API_URL` includes the API prefix (for example `http://localhost:3000/api`); a same-origin reverse proxy can use `/api`. `VITE_BASE_PATH` defaults to `/Sprint1/` to preserve the existing GitHub Pages deployment and can be `/` for a root-domain deployment. Vite embeds these values in the client bundle, so never put secrets in frontend environment variables.

See `../PulseBoardBackend/README.md` for backend setup, database configuration, CORS, and production deployment requirements. The original roadmap and project overview are retained below.



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