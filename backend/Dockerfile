FROM python:3.13-slim

WORKDIR /app

# Install dependencies + netcat for the database check
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    pkg-config \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure permissions
RUN chmod +x entrypoint.sh

# Using ['sh', './entrypoint.sh'] is safer than calling the file directly
ENTRYPOINT ["sh", "./entrypoint.sh"]