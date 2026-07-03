# Stage 1: Build Frontend
FROM node:22-alpine as frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
# Since both run on the same domain, API base URL is just /api
ENV VITE_API_BASE_URL=/api
RUN npm run build

# Stage 2: Build Backend
FROM python:3.13-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt whitenoise

COPY backend/ .
# Copy frontend build from stage 1
COPY --from=frontend-builder /app/frontend/dist /app/frontend_build

# Collect static files for whitenoise
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Start gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "cv_platform.wsgi:application"]
