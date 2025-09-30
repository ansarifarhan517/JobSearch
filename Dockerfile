# ---------------------------
# Frontend Build Image Only
# ---------------------------
# FROM node:20 AS client-builder

# # Set working directory
# WORKDIR /client

# # Install dependencies
# COPY client/package*.json ./
# RUN npm install

# # Copy all frontend code
# COPY client/ .

# # Build the React app (Vite default -> dist/)
# RUN npm run build


# CLIENT OBFUSCATION
# ---------------------------
# Base Image
# ---------------------------
FROM python:3.13-slim

# ---------------------------
# Set working directory
# ---------------------------
WORKDIR /app

# ---------------------------
# Copy Python code and requirements
# ---------------------------
COPY python/ /app/python
COPY requirements.txt /app/requirements.txt

# ---------------------------
# Install system dependencies + Chromium + Chromedriver
# ---------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    chromium-driver \
    wget \
    curl \
    unzip \
    fonts-liberation \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libgtk-3-0 \
    xdg-utils \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ---------------------------
# Upgrade pip and install Python dependencies
# ---------------------------
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

# ---------------------------
# Environment variables for Selenium
# ---------------------------
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_BIN=/usr/bin/chromedriver
ENV PIP_NO_CACHE_DIR=off
ENV PYTHONUNBUFFERED=1

# ---------------------------
# Increase shared memory for Chrome
# ---------------------------
RUN mkdir -p /dev/shm

# ---------------------------
# Default command
# ---------------------------
CMD ["python3", "/app/python/main.py"]
