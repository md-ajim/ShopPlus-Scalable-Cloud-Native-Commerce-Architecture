#!/bin/bash
cd /home/ubuntu/shopplus

#1. Closing old containers
docker-compose down

#2. Building new images (for both frontend and backend)
docker-compose build --pull

# 3. Starting all services (Nginx, Django, Next.js) in the background
docker-compose up -d

# 4. Database migration and static file handling (inside the backend container)
docker-compose exec -T backend python manage.py migrate --noinput

# 5. Deleting unused Docker images (to save server space)
docker image prune -f