# WebSocket Server Deployment Guide - Oracle Cloud Infrastructure

## Prerequisites
- Oracle Cloud account with Compute Instance created
- SSH access to your instance
- Domain name (optional but recommended)

## Step 1: Create Oracle Compute Instance

1. **Login to Oracle Cloud Console**
   - Navigate to: Compute → Instances → Create Instance

2. **Instance Configuration**
   - **Name**: `chesseract-websocket-server`
   - **Image**: Ubuntu 22.04 (recommended) or Ubuntu 20.04
   - **Shape**: VM.Standard.E2.1.Micro (Always Free) or VM.Standard2.1
   - **VCN**: Create new or use existing VCN
   - **Subnet**: Public subnet
   - **Assign Public IP**: Yes
   - **SSH Keys**: Add your SSH public key

3. **Click "Create"** and wait for instance to be in "Running" state

4. **Note your Public IP address** from the instance details

## Step 2: Configure Security Lists (Firewall Rules)

1. **In Oracle Cloud Console**:
   - Go to: Networking → Virtual Cloud Networks → Your VCN → Security Lists
   - Click on "Default Security List"

2. **Add Ingress Rules** (Allow incoming traffic):
   ```
   Rule 1 - SSH:
   - Source Type: CIDR
   - Source CIDR: 0.0.0.0/0
   - IP Protocol: TCP
   - Source Port Range: All
   - Destination Port Range: 22
   
   Rule 2 - HTTP:
   - Source Type: CIDR
   - Source CIDR: 0.0.0.0/0
   - IP Protocol: TCP
   - Source Port Range: All
   - Destination Port Range: 80
   
   Rule 3 - HTTPS:
   - Source Type: CIDR
   - Source CIDR: 0.0.0.0/0
   - IP Protocol: TCP
   - Source Port Range: All
   - Destination Port Range: 443
   
   Rule 4 - WebSocket (if running directly on 3001):
   - Source Type: CIDR
   - Source CIDR: 0.0.0.0/0
   - IP Protocol: TCP
   - Source Port Range: All
   - Destination Port Range: 3001
   ```

## Step 3: Configure Instance Firewall (iptables)

SSH into your instance and run:

```bash
ssh ubuntu@161.118.167.127 # YOUR_INSTANCE_IP

# Update iptables rules
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3001 -j ACCEPT

# Save iptables rules
sudo netfilter-persistent save

# Or if netfilter-persistent is not installed:
sudo apt-get install -y iptables-persistent
```

## Step 4: Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version

# Install build essentials
sudo apt-get install -y build-essential

# Install Git
sudo apt-get install -y git

# Install Nginx (for reverse proxy)
sudo apt-get install -y nginx

# Install PM2 (process manager - optional but recommended)
sudo npm install -g pm2
```

## Step 5: Deploy Your Server Code

```bash
# From your local machine, copy the server folder to Oracle instance
rsync -av --exclude='node_modules' --exclude='docs' server/ ubuntu@YOUR_INSTANCE_IP:~/server/

# SSH into your instance
ssh ubuntu@YOUR_INSTANCE_IP

# Navigate to server directory
cd ~/server

# Install dependencies
npm install

# Create logs directory
mkdir -p logs
```

## Step 6: Configure DNS and Update Server Configuration

### Setup DNS A Record
Point your subdomain to the Oracle instance:
- **Domain**: socket.chesseractindia.com
- **Type**: A Record
- **Value**: YOUR_ORACLE_IP

### Update CORS Settings
Edit `index.ts` and update the CORS origin:

```typescript
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",                    // For local development
      "https://chesseractindia.com",              // Production domain
      "https://www.chesseractindia.com",          // WWW version
      "https://your-app.vercel.app"               // Vercel deployment if applicable
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

## Step 7: Setup as System Service (Recommended)

### Option A: Using systemd (Recommended for production)

```bash
# Copy the service file
sudo cp ~/server/chesseract-websocket.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable chesseract-websocket

# Start the service
sudo systemctl start chesseract-websocket

# Check status
sudo systemctl status chesseract-websocket

# View logs
sudo journalctl -u chesseract-websocket -f
```

### Option B: Using PM2 (Alternative)

```bash
cd ~/server

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Follow the instructions provided by the command above

# Monitor
pm2 status
pm2 logs chesseract-websocket
```

## Step 8: Configure Nginx Reverse Proxy (Required)

This allows you to run the WebSocket server on port 3001 internally while exposing it on port 80/443 with SSL.

```bash
# Remove default nginx config
sudo rm /etc/nginx/sites-enabled/default

# Copy your nginx config
sudo cp ~/server/nginx-config.conf /etc/nginx/sites-available/chesseract-websocket

# Update the config with your subdomain
sudo nano /etc/nginx/sites-available/chesseract-websocket
# Replace 'your-oracle-instance-ip-or-domain' with 'socket.chesseractindia.com'

# Enable the site
sudo ln -s /etc/nginx/sites-available/chesseract-websocket /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# Enable nginx to start on boot
sudo systemctl enable nginx
```

## Step 9: Update Client Configuration

Update your Next.js application's environment variables:

```bash
# In your .env.local or .env.production
NEXT_PUBLIC_SOCKET_URL=https://socket.chesseractindia.com
```

Redeploy your Next.js application (on Vercel or wherever it's hosted).

## Step 10: Setup SSL Certificate (Required)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate for your subdomain
sudo certbot --nginx -d socket.chesseractindia.com

# Certbot will automatically configure nginx for HTTPS
# Follow the prompts

# Test auto-renewal
sudo certbot renew --dry-run
```

## Testing Your Deployment

1. **Test WebSocket Connection**:
   ```bash
   # From your local machine
   curl https://socket.chesseractindia.com
   ```

2. **Check if server is running**:
   ```bash
   # On the instance
   sudo netstat -tulpn | grep 3001
   ```

3. **Test from your application**: Open your Next.js app and try to start a game

4. **Verify SSL is working**: Visit https://socket.chesseractindia.com in your browser

## Maintenance Commands

```bash
# View server logs (systemd)
sudo journalctl -u chesseract-websocket -f

# View server logs (PM2)
pm2 logs chesseract-websocket

# Restart server (systemd)
sudo systemctl restart chesseract-websocket

# Restart server (PM2)
pm2 restart chesseract-websocket

# Update code (from local machine)
scp -r /path/to/the-chesseract/server ubuntu@YOUR_INSTANCE_IP:~/

# Then on the instance
cd ~/server
npm install
sudo systemctl restart chesseract-websocket  # or pm2 restart
```

## Troubleshooting

### WebSocket connection fails:
1. Check if server is running: `sudo systemctl status chesseract-websocket`
2. Check firewall rules in Oracle Cloud Console
3. Check instance iptables: `sudo iptables -L -n`
4. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
5. Check CORS settings in server code

### Server crashes:
1. Check logs: `sudo journalctl -u chesseract-websocket -n 100`
2. Check for port conflicts: `sudo netstat -tulpn | grep 3001`
3. Verify Node.js installation: `node --version`

### Can't connect from client:
1. Verify NEXT_PUBLIC_SOCKET_URL is correct
2. Check browser console for CORS errors
3. Verify Security List rules in Oracle Cloud
4. Test direct connection: `telnet YOUR_ORACLE_IP 3001`

## Security Best Practices

1. **Keep system updated**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Setup firewall properly**: Only expose necessary ports

3. **Use SSL/HTTPS**: Always use HTTPS in production

4. **Limit SSH access**: Consider changing SSH port and using key-only authentication

5. **Regular backups**: Backup your application and database regularly

6. **Monitor logs**: Regularly check application and system logs

## Notes

- Oracle Cloud's Always Free tier includes 2 AMD-based Compute VMs or 4 Arm-based Compute VMs
- The WebSocket server should handle reconnections gracefully (already implemented in your code)
- Consider setting up monitoring (PM2 has built-in monitoring)
- For production, consider using a process manager like PM2 or systemd for auto-restart capabilities

## Quick Start Script

Save this as `setup.sh` on your instance for quick setup:

```bash
#!/bin/bash
# Quick setup script for Oracle Cloud

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential git nginx

# Install PM2
sudo npm install -g pm2

# Configure firewall
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3001 -j ACCEPT
sudo apt-get install -y iptables-persistent

echo "Basic setup complete! Now clone your repository and follow the deployment guide."
```

## Support

If you encounter any issues, check:
1. Server logs
2. Nginx logs
3. Oracle Cloud Console for network/instance issues
4. Ensure all firewall rules are configured correctly
