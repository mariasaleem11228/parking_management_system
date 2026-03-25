# ParkCity — Digital Parking Management UI

A production-ready React frontend for the Digital Parking Management System, built to connect to your Spring Modulith backend.

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 + React Router v6 |
| HTTP Client | Axios (with JWT interceptor) |
| Map | Leaflet + React-Leaflet |
| Charts | Recharts |
| Icons | Lucide React |
| Date utils | date-fns |
| Styling | Plain CSS with CSS variables (no Tailwind needed) |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure backend URL
cp .env.example .env
# Edit .env: REACT_APP_API_URL=http://localhost:8080/api

# 3. Start development server
npm start
```

The UI proxies `/api/*` to `http://localhost:8080` (configured in `package.json`).

---

## Project Structure

```
src/
├── services/
│   └── api.js              ← All Axios calls, organized by backend module
├── context/
│   ├── AuthContext.jsx     ← Global auth state + JWT storage
│   └── ToastContext.jsx    ← Notification system
├── layouts/
│   ├── AdminLayout.jsx     ← Sidebar nav for city admins
│   └── CitizenLayout.jsx   ← Bottom nav / side nav for citizens
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── admin/
│   │   ├── Dashboard.jsx       ← Stats, charts, recent activity
│   │   ├── ZonesPage.jsx       ← CRUD parking zones
│   │   ├── SpacesPage.jsx      ← CRUD parking spaces + status
│   │   ├── PricingPage.jsx     ← Pricing rules per zone/type
│   │   ├── UsersPage.jsx       ← Manage citizens & admins
│   │   ├── ReservationsAdmin.jsx ← Monitor all reservations
│   │   └── BillingAdmin.jsx    ← Revenue charts + invoices
│   └── citizen/
│       ├── CitizenHome.jsx     ← Dashboard + active session
│       ├── ParkingMap.jsx      ← Leaflet map + reserve flow
│       ├── MyReservations.jsx  ← Personal booking history
│       └── MyBilling.jsx       ← Invoices + pay now
└── App.jsx                 ← Routing + role-based guards
```

---

## Backend API Contract

The file `src/services/api.js` documents all expected endpoints. Your teammates need to implement:

### Auth (User Module — `/api/auth`, `/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Returns `{ token, user: { id, name, email, role } }` |
| POST | `/api/auth/register` | Same response as login |
| GET  | `/api/auth/me` | Returns current user |
| GET  | `/api/users` | List users (admin) |
| POST | `/api/users` | Create user (admin) |
| PUT  | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |
| PATCH | `/api/users/{id}/role` | Assign role `{ role: "ADMIN" \| "CITIZEN" }` |

### Parking Management Module (`/api/zones`, `/api/spaces`, `/api/pricing`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/zones` | List / create zones |
| GET/PUT/DELETE | `/api/zones/{id}` | Zone CRUD |
| GET/POST | `/api/spaces` | List / create spaces |
| GET | `/api/spaces/available` | Spaces with status=FREE |
| GET/PUT/DELETE | `/api/spaces/{id}` | Space CRUD |
| GET/POST | `/api/pricing` | List / create pricing rules |
| PUT/DELETE | `/api/pricing/{id}` | Update / delete pricing |

### Reservation Module (`/api/reservations`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reservations` | All reservations (admin) |
| GET | `/api/reservations/my` | Current user's reservations |
| POST | `/api/reservations` | Create reservation `{ spaceId, startTime, endTime }` |
| PATCH | `/api/reservations/{id}/cancel` | Cancel reservation |
| PATCH | `/api/reservations/{id}/finish` | Mark as finished |
| PATCH | `/api/reservations/{id}/checkin` | Check in |

### Billing Module (`/api/billing`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/billing/invoices/my` | Current user's invoices |
| GET | `/api/billing/invoices` | All invoices (admin) |
| POST | `/api/billing/invoices/{id}/pay` | Pay invoice `{ method }` |
| GET | `/api/billing/stats` | Revenue stats for chart |

### Analytics (optional, `/api/analytics`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/zones/summary` | `{ totalZones, totalSpaces, activeReservations, todayRevenue, zoneOccupancy[] }` |
| GET | `/api/analytics/occupancy` | Hourly occupancy array `[{ hour, occupancy }]` |

---

## JWT Authentication

All requests automatically include `Authorization: Bearer <token>` (see `api.js`).

Expected login response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "CITIZEN",
    "licensePlate": "DO-JD-1234"
  }
}
```

**Roles:**
- `CITIZEN` → routed to `/citizen/*`
- `ADMIN` → routed to `/admin/*`

---

## Demo Mode

All pages fall back to realistic demo data if the backend is unreachable. This lets you develop / demo the UI independently.

---

## CORS

Your Spring Boot backend needs to allow the React dev server origin:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:3000"));
    config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    CorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    ((UrlBasedCorsConfigurationSource)source).registerCorsConfiguration("/**", config);
    return source;
}
```

---

## Map Configuration

The map (`ParkingMap.jsx`) uses OpenStreetMap tiles — no API key needed.

For spaces to appear on the map, the backend `GET /api/spaces/available` must return objects with `latitude` and `longitude` fields (or `lat`/`lng`). The map is centered on Dortmund by default.

---

## Deployment

```bash
npm run build
# Outputs to /build — serve as static files
# Or deploy to Vercel / Netlify / any static host
```

For production, set:
```
REACT_APP_API_URL=https://your-backend.example.com/api
```
