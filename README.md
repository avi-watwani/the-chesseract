# ♟️ The Chesseract

<div align="center">

**A modern, full-stack chess platform with real-time multiplayer, training tools, and subscription management**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?logo=supabase)](https://supabase.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-black?logo=socket.io)](https://socket.io/)

[Live Demo](https://the-chesseract.vercel.app) • [Documentation](./current_implementation.md) • [Report Bug](https://github.com/yourusername/the-chesseract/issues)

</div>

---

## 📋 Overview

**The Chesseract** is a comprehensive chess platform that combines:
- 🎮 **Real-time Online Multiplayer** - Play chess with players worldwide
- 📊 **Analysis Tools** - Analyze positions and improve your game
- ✏️ **Board Editor** - Create custom positions
- 💳 **Subscription Plans** - Premium features with Razorpay integration
- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 📱 **Responsive Design** - Works beautifully on all devices

---

## ✨ Key Features

### 🎯 Core Features

**Online Chess Gameplay**
- Real-time multiplayer via WebSockets
- Automatic matchmaking system
- 10-minute game timers
- Legal move validation
- Check & checkmate detection
- Reconnection support (60s grace period)
- Player usernames from profiles
- Sound effects & visual feedback

**Chess Tools**
- **Analysis Board** - Free-form position analysis
- **Board Editor** - Create and edit positions
- **Move History** - Algebraic notation display
- **Captured Pieces** - Visual piece tracking
- **Arrow Drawing** - Annotate moves and ideas

**Authentication & Payments**
- Email/username login & signup
- JWT-based session management
- Protected routes (middleware)
- Razorpay payment integration
- 3 subscription tiers (Beginner, Intermediate, Advanced)
- Automatic subscription management

**Additional Pages**
- Courses & learning resources
- Coach profiles
- Blog & news
- Contact form
- About page

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS
- **UI:** Lucide React Icons
- **Real-time:** Socket.io Client

### Backend
- **WebSocket Server:** Node.js + Socket.io (AWS EC2)
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth
- **Payments:** Razorpay

### Deployment
- **Frontend:** Vercel (auto-deploy)
- **WebSocket:** AWS EC2 + PM2
- **Database:** Supabase Cloud

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Supabase account
- Razorpay account (for payments)
- AWS EC2 instance (for WebSocket server)

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/the-chesseract.git
cd the-chesseract

# Install frontend dependencies
npm install

# Install WebSocket server dependencies
cd server
npm install
cd ..
```

### 2. Setup Environment Variables

Create `.env.local` in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx

# WebSocket Server
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 3. Setup Database

Go to [Supabase Dashboard](https://app.supabase.com/):

1. Click **SQL Editor** → **New Query**
2. Run `database/supabase-profiles-schema.sql` (creates profiles table)
3. Run `database/supabase-payments-schema.sql` (creates payments & subscriptions)

### 4. Start Development Servers

**Option A: Use the startup script**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Option B: Manual start**
```bash
# Terminal 1: WebSocket Server
cd server
npm run dev

# Terminal 2: Next.js Frontend
npm run dev
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Play Chess:** http://localhost:3000/play
- **WebSocket Server:** http://localhost:3001

---

## 🎮 Usage Guide

### Playing Online Chess

1. **Sign Up / Login**
   - Navigate to `/login` or `/signup`
   - Create account with email, username, and password

2. **Find a Game**
   - Go to `/play`
   - Click "Find a Game"
   - Wait for matchmaking (automatic pairing)

3. **Play the Game**
   - Drag & drop pieces or click to move
   - Right-click drag to draw arrows
   - Use Resign or Draw buttons if needed

4. **Game Features**
   - Timer counts down on your turn
   - Move history shows all moves
   - Captured pieces displayed on side
   - Reconnect if disconnected (60s grace)

### Subscribing to Plans

1. Click "Buy Now" on any plan on the homepage
2. Login if not authenticated
3. Complete payment via Razorpay (Test card: `4111 1111 1111 1111`)
4. Your plan will appear in the navbar

---

## 📁 Project Structure

```
the-chesseract/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Auth pages (login, signup)
│   ├── (main)/                   # Main pages (home, play, etc.)
│   ├── api/                      # API routes
│   ├── components/               # React components
│   ├── hooks/                    # Custom hooks
│   ├── types/                    # TypeScript types
│   └── utils/                    # Utility functions
├── server/                       # WebSocket server
│   ├── index.ts                  # Main server file
│   └── package.json              # Server dependencies
├── database/                     # Database schemas
│   ├── supabase-profiles-schema.sql
│   └── supabase-payments-schema.sql
├── public/                       # Static assets
├── current_implementation.md     # Detailed documentation
└── README.md                     # This file
```

---

## 🗄️ Database Schema

### Tables

**profiles** - User profile information
- `id`, `username`, `email`, `created_at`, `updated_at`
- Case-insensitive unique usernames
- Auto-created on signup

**payments** - Payment transaction records
- `id`, `user_id`, `razorpay_order_id`, `plan_name`, `amount`, `status`
- Tracks all payment attempts
- Links to Razorpay transactions

**subscriptions** - Active user subscriptions
- `id`, `user_id`, `plan_name`, `amount`, `status`, `next_renewal_at`
- Auto-created/updated on successful payment
- One subscription per user

---

## 🔐 Security

- ✅ JWT tokens in HTTP-only cookies
- ✅ Row Level Security (RLS) on all tables
- ✅ HMAC-SHA256 payment verification
- ✅ Server-side API key protection
- ✅ Middleware route protection
- ✅ SQL injection prevention

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Connect GitHub repo to Vercel
# Set environment variables in Vercel Dashboard
# Push to main branch → auto-deploy
git push origin main
```

### WebSocket Server (AWS EC2)
```bash
# SSH into EC2
ssh user@your-ec2-ip

# Navigate to server directory
cd chesseract-server/

# Update code
git pull origin main

# Restart PM2
pm2 restart all

# Check logs
pm2 logs
```

### Database (Supabase)
- Managed service (no deployment needed)
- Automatic backups enabled
- Run migrations via SQL Editor

---

## 🧪 Testing

### Test Accounts
Create test accounts via `/signup`

### Test Payment Cards (Razorpay)
- **Success:** `4111 1111 1111 1111`
- **Success:** `4012 8888 8888 1881`
- **Failed:** `5555 5555 5555 4444`
- Use any CVV and future expiry date

### Manual Testing Checklist
- [ ] Sign up new account
- [ ] Login with email
- [ ] Login with username
- [ ] Find chess game
- [ ] Make moves
- [ ] Reconnect during game
- [ ] Purchase subscription
- [ ] Verify plan in navbar

---

## 📚 Documentation

- **[Complete Implementation Guide](./current_implementation.md)** - Detailed technical documentation
- **[Database Schemas](./database/)** - SQL migration files
- **Architecture diagrams, API docs, deployment guides** - See `current_implementation.md`

---

## 🐛 Known Limitations

1. **En Passant** - Not implemented
2. **Pawn Promotion** - Not implemented
3. **Draw Acceptance** - No UI (event sent but not handled)
4. **Game Persistence** - Games stored in memory only
5. **WebSocket Scaling** - Single EC2 instance (100-500 concurrent users)

See [current_implementation.md](./current_implementation.md) for solutions.

---

## 🔮 Future Roadmap

### Phase 1 ✅ (Current)
- ✅ Real-time multiplayer chess
- ✅ Authentication system
- ✅ Payment integration
- ✅ Analysis tools

### Phase 2 (Next 3-6 months)
- [ ] Computer AI opponent (Stockfish)
- [ ] Game database with PGN export
- [ ] Puzzle trainer
- [ ] User rating system (ELO)
- [ ] Tournament system

### Phase 3 (6-12 months)
- [ ] Mobile app (React Native)
- [ ] Social features (friends, chat)
- [ ] Spectator mode
- [ ] Advanced analytics
- [ ] Admin dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Chess piece images and design inspiration
- Next.js, Supabase, and Socket.io communities
- Modern chess platforms (Chess.com, Lichess) for UX inspiration

---

## 📧 Contact

**Project Link:** [https://github.com/yourusername/the-chesseract](https://github.com/yourusername/the-chesseract)

**Live Demo:** [https://the-chesseract.vercel.app](https://the-chesseract.vercel.app)

---

<div align="center">

**Made with ♟️ by The Chesseract Team**

⭐ Star this repo if you find it helpful!

</div>
