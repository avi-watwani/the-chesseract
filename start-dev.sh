#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting The Chesseract Development Environment${NC}\n"

# Check if server dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Installing server dependencies...${NC}"
    cd server
    npm install
    cd ..
    echo -e "${GREEN}✅ Server dependencies installed${NC}\n"
fi

# Function to cleanup background processes
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    kill $SERVER_PID 2>/dev/null
    kill $NEXT_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Trap CTRL+C
trap cleanup INT TERM

# Start WebSocket Server
echo -e "${BLUE}Starting WebSocket server on port 3001...${NC}"
cd server
npm run dev &
SERVER_PID=$!
cd ..

# Wait for server to start
sleep 2

# Start Next.js App
echo -e "${BLUE}Starting Next.js app on port 3000...${NC}"
npm run dev &
NEXT_PID=$!

echo -e "\n${GREEN}✅ Both servers are running!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "📱 Next.js App:      ${GREEN}http://localhost:3000${NC}"
echo -e "🔌 WebSocket Server: ${GREEN}http://localhost:3001${NC}"
echo -e "🎮 Play Chess:       ${GREEN}http://localhost:3000/play${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "\n${YELLOW}Press CTRL+C to stop all servers${NC}\n"

# Wait for both processes
wait $SERVER_PID $NEXT_PID

