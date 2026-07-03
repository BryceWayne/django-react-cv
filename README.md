# Security Camera CV Platform Demo

A mock security camera platform demonstrating a full-stack architecture using a Django backend and a React (Vite) frontend.

## Architecture & Setup

The project is structured into two main directories:
- `backend/`: A Django project serving a RESTful API using Django Rest Framework.
- `frontend/`: A React SPA built with Vite and TailwindCSS for a premium, dark-mode design.

### Backend Details
- Configured **Django REST Framework** with `rest_framework.authtoken` for token-based authentication.
- Created `Camera` and `CVEvent` models to represent the state of the security cameras and the events logged by the hypothetical computer vision models.
- Set up a database seed script (`seed.py`) that populated the SQLite database with 3 active cameras, 1 offline camera, and a rolling log of mock CV events over the last hour.
- Added a superuser `admin` with password `password123` for demonstration purposes.
- Enabled CORS via `django-cors-headers` so the React frontend can easily communicate with the API during development.

### Frontend Details
- Initialized the Vite React application and installed `react-router-dom` for client-side routing and `lucide-react` for beautiful iconography.
- Set up **TailwindCSS (v3)** to handle styling, implementing a sleek glassmorphism and dark mode aesthetic.
- Created two main views:
  - **Login Page (`/login`)**: A secure authentication screen that exchanges credentials for a token via the Django API.
  - **Dashboard (`/`)**: A dynamic, real-time interface split into a navigation sidebar, a live grid of camera feeds, and a system event log.
- **CameraFeed Component**: Renders a mock camera stream using a mix of CSS gradients and animations to simulate a live video loop. It also includes dynamic bounding box overlays (e.g., "Person detected: 98%") that trigger intermittently to simulate real-time computer vision inference.
- **EventLog Component**: Fetches and displays a color-coded log of recent events from the Django backend, giving a unified view of all system alerts (motion, vehicles, persons).

## How to Run the Application

### Option 1: Using Docker (Recommended)
You can spin up the entire platform using Docker Compose. This will build a production-ready Nginx container for the React frontend and a Gunicorn container for the Django backend.

```bash
docker compose up --build -d
```
Once running:
- **Frontend Dashboard**: http://localhost
- **Backend API**: http://localhost:8000/api/

### Option 2: Local Development Setup
You can run both servers simultaneously in separate terminal windows.

**Terminal 1 (Django Backend):**
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

**Terminal 2 (React Frontend):**
```bash
cd frontend
npm run dev
```

Once both are running, open the local Vite URL (typically `http://localhost:5173`) in your browser. Log in using `admin` / `password123` to view the live dashboard!

> **Note**: The Dashboard simulates real-time activity by polling the Django API every 10 seconds for new events and triggering CSS-based bounding box mockups on the camera feeds.