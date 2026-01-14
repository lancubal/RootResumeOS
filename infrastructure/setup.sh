#!/bin/bash

# ==============================================================================
# Setup Script for AWS EC2 / DigitalOcean Droplet
# OS: Ubuntu 22.04 / 24.04 LTS
# Project: Secure RCE Portfolio
# ==============================================================================

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting Server Provisioning..."

# 1. System Updates
echo "🔄 Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Configure Swap Memory (Critical for low-RAM instances like t3.small)
# Prevents OOM Kills during heavy compilation or concurrent Docker usage
if [ ! -f /swapfile ]; then
    echo "💾 Creating 2GB Swap file..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ Swap created successfully."
else
    echo "✅ Swap file already exists."
fi

# 3. Install Docker Engine
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Add current user to docker group (avoids using sudo for docker commands)
    sudo usermod -aG docker $USER
    echo "✅ Docker installed."
else
    echo "✅ Docker is already installed."
fi

# 4. Install Node.js 20.x
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js installed: $(node -v)"
else
    echo "✅ Node.js is already installed: $(node -v)"
fi

# 5. Install Nginx and Certbot
echo "🌐 Installing Nginx and Certbot..."
sudo apt-get install -y nginx certbot python3-certbot-nginx

# 6. Install PM2 (Process Manager for Node.js)
echo "📈 Installing PM2..."
sudo npm install -g pm2

# 7. Pre-pull Docker Images (Speed up first execution)
echo "📥 Pulling Docker images..."
sudo docker pull python:3.10-alpine
# sudo docker pull gcc:latest # Uncomment if C support is added later
# sudo docker pull rust:alpine # Uncomment if Rust support is added later

echo "✨ Provisioning Complete! Please logout and login again to apply Docker group changes."

