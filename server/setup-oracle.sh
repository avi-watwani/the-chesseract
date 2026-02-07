#!/bin/bash

# Chesseract WebSocket Server - Oracle Cloud Setup Script
# Run this script on your Oracle Cloud instance after cloning the repository

set -e

echo "==================================="
echo "Chesseract WebSocket Server Setup"
echo "==================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Update system
echo -e "${GREEN}[1/8] Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js
echo -e "${GREEN}[2/8] Installing Node.js v20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

# Verify Node installation
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install Git
echo -e "${GREEN}[3/8] Installing Git...${NC}"
sudo apt-get install -y git

# Install Nginx
echo -e "${GREEN}[4/8] Installing Nginx...${NC}"
sudo apt-get install -y nginx

# Install PM2
echo -e "${GREEN}[5/8] Installing PM2 (Process Manager)...${NC}"
sudo npm install -g pm2

# Configure firewall
echo -e "${GREEN}[6/8] Configuring firewall rules...${NC}"
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3001 -j ACCEPT

# Install iptables-persistent to save rules
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y iptables-persistent

# Save iptables rules
sudo netfilter-persistent save

# Install server dependencies
echo -e "${GREEN}[7/8] Installing server dependencies...${NC}"
cd /home/ubuntu/the-chesseract/server
npm install

# Create logs directory
mkdir -p logs

echo -e "${GREEN}[8/8] Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update CORS origins in server/index.ts with your production domain/IP"
echo "2. Setup the service: sudo cp chesseract-websocket.service /etc/systemd/system/"
echo "3. Enable and start: sudo systemctl enable chesseract-websocket && sudo systemctl start chesseract-websocket"
echo "4. Configure Nginx: sudo cp nginx-config.conf /etc/nginx/sites-available/chesseract"
echo "5. Update nginx config with your domain/IP"
echo "6. Enable nginx site: sudo ln -s /etc/nginx/sites-available/chesseract /etc/nginx/sites-enabled/"
echo "7. Restart nginx: sudo systemctl restart nginx"
echo ""
echo -e "${GREEN}For detailed instructions, see DEPLOYMENT_GUIDE.md${NC}"
