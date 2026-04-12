🧠 Smart Home Control Dashboard

A full-stack real-time IoT dashboard for monitoring and managing smart home environments with role-based access and per-home configuration.

🚀 Overview

This project simulates a smart home control system where users can monitor sensors, receive alerts, and manage security settings in real time.

It supports multiple homes per user, role-based access control, and dynamic configuration per home (admin panel).

The application was built to demonstrate real-world frontend and backend architecture, including state management, real-time communication, and scalable project structure.

✨ Features
🔐 Authentication (JWT-based)
👥 Role system (Admin / User)
🏠 Multi-home support (user can access multiple homes)
📡 Real-time updates via WebSocket
📊 Live sensor monitoring (temperature, humidity, power)
🚨 Alert system (threshold-based + door open detection)
🔊 Sound notifications for alerts
⚙️ Admin settings panel:
Rename sensors
Configure alert thresholds
Security rules (door open duration)
💾 Dynamic per-home configuration (backend-driven)
⚡ Optimistic UI updates (React Query)
🧪 Form validation with Zod + React Hook Form
💅 Modern UI:
Toast notifications
Skeleton loading
Responsive dashboard layout
🧱 Tech Stack
Frontend
React
TypeScript
Vite
React Query
React Hook Form
Zod
WebSocket (native)
Lucide Icons
Backend
Node.js
Express
TypeScript
WebSocket (ws)
In-memory store (simulated DB)
🏗️ Architecture

The application is structured using a feature-based architecture on the frontend and modular routing on the backend.

Frontend
src/
  components/        # shared UI (Toast, Skeleton, etc.)
  features/
    dashboard/
    settings/
    auth/
React Query handles server state and caching
WebSocket updates are merged into the query cache
Settings are dynamically fetched and applied per home
Backend
server/src/
  auth/
  home/
  settings/
settings module manages per-home configuration
homeStore simulates real-time sensor data
alert logic uses dynamic settings (thresholds, rules)
⚙️ How to Run
1. Clone repo
gh repo clone JacekPasierb/smartHome-controlWS
cd smart-home-dashboard
2. Install dependencies
Client
cd client
npm install
Server
cd ../server
npm install
3. Run backend
cd server
npm run dev

Server runs on:

http://localhost:4000
4. Run frontend
cd client
npm run dev

App runs on:

http://localhost:5173
🔑 Demo Accounts
Admin:
login: admin
password: admin

User:
login: user
password: user
🧪 Example API
Get home settings
GET /api/home/:homeId/settings
Authorization: Bearer <token>
Update settings (admin only)
PATCH /api/home/:homeId/settings

Example body:

{
  "sensors": {
    "temp_fridge": {
      "name": "Premium Fridge",
      "max": 6
    }
  },
  "security": {
    "doorOpenTooLongSeconds": 5
  }
}
📈 Key Concepts Demonstrated
Real-time data handling (WebSockets + React Query)
Multi-tenant architecture (per-home settings)
Role-based access control (RBAC)
Separation of concerns (feature-based frontend structure)
Optimistic updates & cache synchronization
Form validation with schema (Zod)
UI/UX polish (skeletons, toasts, state handling)
📌 Future Improvements
Persistent database (PostgreSQL / MongoDB)
Docker + production deployment
Dynamic simulator configuration (live interval updates)
Audit logs for admin actions
Mobile optimization
🧑‍💻 Author

Created by Jacek Pasierb