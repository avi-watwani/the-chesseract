# Quick Reference - Oracle Cloud Deployment

## 🚀 Quick Deploy Commands

### First Time Setup
```bash
# 1. From your local machine, copy server folder to Oracle instance
scp -r /path/to/the-chesseract/server ubuntu@YOUR_ORACLE_IP:~/

# 2. SSH into your Oracle instance
ssh ubuntu@YOUR_ORACLE_IP

# 3. Navigate to server directory
cd ~/server

# 4. Run setup script
chmod +x setup-oracle.sh
./setup-oracle.sh

# 5. Update CORS in index.ts (add your domains)
nano index.ts

# 6. Start the service
sudo cp chesseract-websocket.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable chesseract-websocket
sudo systemctl start chesseract-websocket

# 7. Configure nginx
sudo cp nginx-config.conf /etc/nginx/sites-available/chesseract-websocket
sudo nano /etc/nginx/sites-available/chesseract-websocket  # Update with socket.chesseractindia.com
sudo ln -s /etc/nginx/sites-available/chesseract-websocket /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 8. Setup SSL
sudo certbot --nginx -d socket.chesseractindia.com
```

### Oracle Cloud Security Rules (In Console)
```
Port 22  - SSH
Port 80  - HTTP
Port 443 - HTTPS
Port 3001 - WebSocket (optional if using nginx)
```

### Essential Commands

**Check Status:**
```bash
sudo systemctl status chesseract-websocket
```

**View Logs:**
```bash
sudo journalctl -u chesseract-websocket -f
```

**Restart Server:**
```bash
sudo systemctl restart chesseract-websocket
```

**Update Code:**
```bash
# From your local machine, copy updated server folder
scp -r /path/to/the-chesseract/server ubuntu@YOUR_ORACLE_IP:~/

# SSH into instance
ssh ubuntu@YOUR_ORACLE_IP

# Install dependencies and restart
cd ~/server
npm install
sudo systemctl restart chesseract-websocket
```

**Check if Port is Open:**
```bash
sudo netstat -tulpn | grep 3001
```

### Environment Variable to Update in Your Next.js App
```bash
NEXT_PUBLIC_SOCKET_URL=https://socket.chesseractindia.com
```

## 🔥 Troubleshooting Quick Fixes

**Can't connect to WebSocket?**
```bash
# 1. Check if server is running
sudo systemctl status chesseract-websocket

# 2. Check firewall
sudo iptables -L -n | grep 3001

# 3. Add firewall rule if missing
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3001 -j ACCEPT
sudo netfilter-persistent save

# 4. Check nginx (if using reverse proxy)
sudo nginx -t
sudo systemctl status nginx
```

**Server won't start?**
```bash
# Check logs
sudo journalctl -u chesseract-websocket -n 50

# Check if port is in use
sudo netstat -tulpn | grep 3001

# Kill process if needed
sudo kill -9 $(sudo lsof -t -i:3001)

# Restart
sudo systemctl restart chesseract-websocket
```

## 📝 CORS Origins to Add in index.ts

```typescript
origin: [
  "http://localhost:3000",                    // For local development
  "https://chesseractindia.com",              // Production domain
  "https://www.chesseractindia.com",          // WWW version
  "https://your-vercel-app.vercel.app"        // If using Vercel
]
```

## 🔒 SSL Certificate Setup (Required)

```bash
# Install certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate for subdomain
sudo certbot --nginx -d socket.chesseractindia.com

# Test renewal
sudo certbot renew --dry-run
```

## 📊 Monitoring

```bash
# Real-time logs
sudo journalctl -u chesseract-websocket -f

# System resources
htop

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## ⚡ PM2 Alternative Commands (If using PM2 instead of systemd)

```bash
# Start
pm2 start ecosystem.config.js

# Status
pm2 status

# Logs
pm2 logs chesseract-websocket

# Restart
pm2 restart chesseract-websocket

# Stop
pm2 stop chesseract-websocket

# Save process list
pm2 save

# Auto-start on boot
pm2 startup systemd
```
