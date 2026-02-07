# Chesseract WebSocket Server

This is the WebSocket server for The Chesseract online chess platform, handling real-time game connections, matchmaking, and game state management.

## Features

- Real-time chess game matchmaking
- Game state synchronization
- Timer management (10-minute games)
- Reconnection handling with 60-second grace period
- Move validation and broadcasting
- Game end conditions (timeout, resignation, disconnection)

## Local Development

### Prerequisites
- Node.js v20 or higher
- npm or yarn

### Setup

```bash
cd server
npm install
npm run dev
```

The WebSocket server will start on `http://localhost:3001`

## Production Deployment

### Oracle Cloud Infrastructure

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for complete step-by-step instructions.

Quick start:
```bash
# On your Oracle instance
git clone <your-repo>
cd the-chesseract/server
chmod +x setup-oracle.sh
./setup-oracle.sh
```

See **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** for essential commands.

## Configuration Files

- `index.ts` - Main WebSocket server code
- `ecosystem.config.js` - PM2 process manager configuration
- `chesseract-websocket.service` - systemd service configuration
- `nginx-config.conf` - Nginx reverse proxy configuration
- `.env.production` - Production environment variables

## Server Events

### Client → Server
- `findGame` - Join matchmaking queue
- `cancelSearch` - Leave matchmaking queue
- `rejoinGame` - Reconnect to existing game
- `makeMove` - Make a chess move
- `resign` - Resign from game
- `drawOffer` - Offer draw to opponent

### Server → Client
- `gameFound` - Match found, game starting
- `gameRejoined` - Successfully rejoined game
- `moveMade` - Opponent made a move
- `timerUpdate` - Clock time update
- `opponentDisconnected` - Opponent lost connection
- `opponentReconnected` - Opponent reconnected
- `gameEnded` - Game finished
- `timeoutLoss` - Player ran out of time
- `drawOffered` - Opponent offered draw

## Architecture

```
┌─────────────┐         WebSocket         ┌──────────────┐
│   Client    │ ◄──────────────────────► │    Server    │
│  (Next.js)  │      (Socket.io)          │  (Node.js)   │
└─────────────┘                            └──────────────┘
                                                   │
                                                   ▼
                                          ┌────────────────┐
                                          │  Game State    │
                                          │  - Active Games│
                                          │  - Timers      │
                                          │  - Players     │
                                          └────────────────┘
```

## Monitoring

### Using systemd
```bash
# View logs
sudo journalctl -u chesseract-websocket -f

# Check status
sudo systemctl status chesseract-websocket

# Restart
sudo systemctl restart chesseract-websocket
```

### Using PM2
```bash
# View logs
pm2 logs chesseract-websocket

# Check status
pm2 status

# Restart
pm2 restart chesseract-websocket
```

## Troubleshooting

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#troubleshooting) for common issues and solutions.

## Security Considerations

1. **CORS**: Update CORS origins in `index.ts` with your production domains
2. **Firewall**: Ensure proper firewall rules in Oracle Cloud Security Lists
3. **SSL**: Use HTTPS/WSS in production with SSL certificates
4. **Rate Limiting**: Consider adding rate limiting for production
5. **Authentication**: Integrate with your authentication system

## License

MIT
