# The Chesseract - Current Implementation Documentation

## 📋 Project Overview

**The Chesseract** is a full-stack modern chess training platform that provides online gameplay, analysis tools, courses, and coaching services. It combines a Next.js frontend with real-time WebSocket functionality, secure authentication, and integrated payment processing.

**Live Application**: Deployed on Vercel  
**WebSocket Server**: Deployed on AWS EC2  
**Database & Auth**: Supabase (PostgreSQL)  
**Payment Gateway**: Razorpay

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │  Next.js App   │  │  Socket.io     │  │  Razorpay SDK   │  │
│  │  (React/TS)    │  │  Client        │  │  (Payments)     │  │
│  └────────────────┘  └────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
           ↓                    ↓                      ↓
┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│   Vercel         │  │   AWS EC2        │  │   Razorpay      │
│   (Frontend)     │  │   (WebSocket)    │  │   (Gateway)     │
│  ─────────────   │  │  ─────────────   │  │  ──────────     │
│  • Next.js 14    │  │  • Socket.io     │  │  • Orders       │
│  • SSR/SSG       │  │  • Port 3001     │  │  • Verify       │
│  • API Routes    │  │  • ts-node       │  │  • Signatures   │
│  • Middleware    │  │  • PM2 Process   │  │                 │
└──────────────────┘  └──────────────────┘  └─────────────────┘
           ↓                                          ↓
┌───────────────────────────────────────────────────────────────┐
│                      Supabase                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  PostgreSQL  │  │   Auth API   │  │   Row Level      │   │
│  │  Database    │  │   (JWT)      │  │   Security       │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│                                                               │
│  Tables:                                                      │
│  • profiles (username, email)                                │
│  • payments (transactions)                                   │
│  • subscriptions (user plans)                                │
└───────────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Architecture (Next.js 14)

### Technology Stack
- **Framework**: Next.js 14.2.28 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Lucide React Icons
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Real-time**: Socket.io-client 4.7.4
- **Authentication**: Supabase SSR

### Project Structure

```
app/
├── (auth)/                    # Authentication routes (separate layout)
│   ├── layout.tsx            # Auth-specific layout (no navbar/footer)
│   ├── login/page.tsx        # Login page
│   └── signup/page.tsx       # Signup page
│
├── (main)/                   # Main application routes (with navbar/footer)
│   ├── layout.tsx            # Main layout wrapper
│   ├── page.tsx              # Homepage with pricing/plans
│   ├── play/page.tsx         # Online chess game
│   ├── analysis/page.tsx     # Chess board analysis tool
│   ├── editor/page.tsx       # Chess position editor
│   ├── courses/              # Course pages
│   ├── coaches/              # Coach profiles
│   ├── about/page.tsx        # About page
│   ├── blog/page.tsx         # Blog listing
│   ├── contact/page.tsx      # Contact form
│   └── shop/page.tsx         # Chess store
│
├── api/                      # API routes (serverless functions)
│   ├── auth/callback/        # OAuth callback handler
│   ├── razorpay/
│   │   ├── create-order/     # Create Razorpay order
│   │   └── verify-payment/   # Verify payment signature
│   ├── contact/              # Contact form submission
│   └── socket/               # Socket.io route (legacy, not used)
│
├── components/               # Reusable React components
│   ├── Navbar.tsx            # Navigation with auth state
│   ├── Footer.tsx            # Footer component
│   ├── PageContainer.tsx     # Page wrapper
│   ├── Hero.tsx              # Homepage hero section
│   ├── chess/                # Chess-specific components
│   │   ├── ChessBoardCore.tsx    # Main chess board
│   │   ├── Square.tsx            # Individual square
│   │   ├── Piece.tsx             # Chess piece component
│   │   ├── MoveHistory.tsx       # Move notation display
│   │   ├── CapturedPieces.tsx    # Captured pieces display
│   │   ├── GameControls.tsx      # Game action buttons
│   │   ├── PiecePalette.tsx      # Piece selection for editor
│   │   └── PieceBin.tsx          # Trash bin for editor
│   └── [other components]
│
├── hooks/                    # Custom React hooks
│   ├── useBoardState.ts      # Chess board state management
│   ├── useGameLogic.ts       # Chess rules & validation
│   ├── useSocketGame.ts      # WebSocket game connection
│   ├── useMoveHistory.ts     # Move history tracking
│   └── useArrows.ts          # Arrow drawing on board
│
├── utils/                    # Utility functions
│   ├── chessLogic.ts         # Chess move validation logic
│   ├── sounds.ts             # Sound effects manager
│   └── supabase/             # Supabase clients
│       ├── client.ts         # Browser client
│       ├── server.ts         # Server client
│       └── middleware.ts     # Auth middleware
│
├── types/                    # TypeScript type definitions
│   ├── chess.ts              # Chess-related types
│   └── game.ts               # Game state types
│
├── globals.css               # Global styles
└── layout.tsx                # Root layout (HTML wrapper)

middleware.ts                 # Next.js middleware (auth protection)
```

### Key Features

#### 1. **Authentication Flow**
- **Sign Up**: Email + password + username (unique, case-insensitive)
- **Login**: Email or username + password
- **Session Management**: Supabase JWT tokens in HTTP-only cookies
- **Protected Routes**: Middleware redirects unauthenticated users from `/play`
- **Profile Storage**: User profiles stored in `profiles` table

#### 2. **Chess Game (Real-time Multiplayer)**
Location: `app/(main)/play/page.tsx`

**Features**:
- ✅ Real-time online multiplayer via WebSockets
- ✅ Authentication required
- ✅ Automatic matchmaking
- ✅ 10-minute timer per player
- ✅ Move validation (legal moves only)
- ✅ Check/checkmate detection
- ✅ Captured pieces display
- ✅ Move history with algebraic notation
- ✅ Draw arrows on board (right-click drag)
- ✅ Drag-and-drop pieces
- ✅ Resign & draw offer buttons
- ✅ Sound effects (move, capture, check, game end)
- ✅ Player names displayed (from Supabase profiles)
- ✅ Reconnection support (60-second grace period)

**Game Flow**:
1. User clicks "Find a Game"
2. Client sends `findGame` event with userId + username
3. Server matches two players and assigns colors randomly
4. Game starts with 10:00 timer for each player
5. Players make moves (validated on both client and server)
6. Timer counts down on current player's turn
7. Game ends on: checkmate, timeout, resignation, or draw

#### 3. **Chess Analysis Tool**
Location: `app/(main)/analysis/page.tsx`

**Features**:
- Interactive chess board
- Manual piece movement
- Undo/redo moves
- Reset board
- Move history
- No validation (free movement)

#### 4. **Chess Board Editor**
Location: `app/(main)/editor/page.tsx`

**Features**:
- Drag pieces from palette onto board
- Remove pieces by dragging to trash bin
- Clear board
- Save position (future: FEN export)

#### 5. **Payment Integration (Razorpay)**
Location: `app/(main)/page.tsx` (Homepage)

**Plans**:
- Beginner: ₹1,999
- Intermediate: ₹4,999
- Advanced: ₹9,999

**Payment Flow**:
1. User clicks "Buy Now" → Authentication check
2. If not logged in → redirect to `/login`
3. If logged in → API creates Razorpay order + pending payment record
4. Razorpay checkout modal opens
5. User completes payment (test card: 4111 1111 1111 1111)
6. Payment verified via HMAC-SHA256 signature
7. Database trigger creates/updates subscription
8. Navbar updates to show plan name

**Security**:
- Server-side order creation
- Signature verification with secret key
- User ID linked to all payments
- Row Level Security enforced

#### 6. **Navbar Features**
- **Not Logged In**: Login/Signup buttons
- **Logged In**:
  - Username display
  - Plan badge (if subscribed)
  - Account dropdown with:
    - User info
    - Current plan
    - Renewal date
    - Logout button

---

## 🔌 WebSocket Server (Node.js + Socket.io)

### Location
`server/index.ts`

### Deployment
- **Platform**: AWS EC2
- **Port**: 3001
- **Process Manager**: PM2 (keeps server running)
- **Runtime**: ts-node (runs TypeScript directly)

### Server Configuration

**Package.json**:
```json
{
  "name": "chesseract-server",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node index.ts",
    "start": "ts-node index.ts"
  },
  "dependencies": {
    "socket.io": "^4.6.1",
    "uuid": "^9.0.0"
  }
}
```

**PM2 Commands**:
```bash
cd chesseract-server/
pm2 restart all              # Restart all processes
pm2 logs --follow            # View real-time logs
pm2 status                   # Check process status
pm2 save                     # Save current process list
```

### Data Structures

```typescript
type Player = {
  id: string;                // Socket ID (changes on reconnect)
  userId: string;            // Persistent user ID (localStorage)
  name: string;              // Username from Supabase profile
  socket: any;               // Socket connection
  connected: boolean;        // Connection status
  disconnectTime?: number;   // Timestamp of disconnect
  disconnectTimeout?: NodeJS.Timeout;  // 60s grace period
};

type Game = {
  id: string;                // UUID
  white: Player;             // White player
  black: Player;             // Black player
  moves: string[];           // Array of moves (e.g., ["e2-e4", "e7-e5"])
  whiteTime: number;         // Seconds remaining
  blackTime: number;         // Seconds remaining
  currentTurn: 'white' | 'black';
  status: 'waiting' | 'playing' | 'ended';
  timerInterval?: NodeJS.Timeout;
  boardState?: string;       // FEN string (for reconnection)
};
```

### Socket Events

#### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `findGame` | `{ userId, username }` | Request to join matchmaking |
| `cancelSearch` | - | Cancel matchmaking |
| `makeMove` | `{ gameId, from, to, boardState }` | Make a move |
| `resign` | `{ gameId }` | Resign the game |
| `drawOffer` | `{ gameId }` | Offer a draw |
| `rejoinGame` | `{ userId, gameId }` | Reconnect to existing game |

#### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `gameFound` | `{ gameId, color, opponent }` | Match found |
| `moveMade` | `{ from, to }` | Opponent made a move |
| `timerUpdate` | `{ whiteTime, blackTime }` | Timer sync (every 1s) |
| `timeoutLoss` | `{ winner, loser, reason }` | Game ended by timeout |
| `gameEnded` | `{ winner, reason }` | Game over |
| `opponentDisconnected` | `{ playerColor, gracePeriodSeconds }` | Opponent disconnected |
| `opponentReconnected` | `{ playerColor }` | Opponent reconnected |
| `gameRejoined` | `{ gameId, color, opponent, whiteTime, blackTime, currentTurn, moves, boardState }` | Successfully rejoined |
| `rejoinFailed` | `{ reason }` | Rejoin failed |

### Key Features

1. **Matchmaking**: Pairs waiting players and randomly assigns colors
2. **Timer Management**: 10-minute countdown per player, starts after each move
3. **Reconnection**: 60-second grace period if player disconnects
4. **Move Validation**: Verifies turn order on server
5. **Game Persistence**: Stores all moves for replay on reconnection
6. **Cleanup**: Games auto-delete 30 seconds after ending

### Deployment Process

```bash
# 1. Copy updated file to EC2
scp server/index.ts user@ec2-ip:/path/to/chesseract-server/

# 2. SSH into EC2
ssh user@ec2-ip

# 3. Navigate to server directory
cd chesseract-server/

# 4. Restart PM2
pm2 restart all

# 5. Verify
pm2 logs --lines 20
```

---

## 🗄️ Database Architecture (Supabase/PostgreSQL)

### Tables

#### 1. **profiles**
Stores user profile information.

**Schema**:
```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case-insensitive unique index
CREATE UNIQUE INDEX profiles_username_unique_idx ON profiles(LOWER(username));
```

**Policies (RLS)**:
- ✅ Anyone can SELECT (for username lookups)
- ✅ Users can INSERT their own profile
- ✅ Users can UPDATE their own profile

**Auto-creation**: Trigger creates profile on user signup

#### 2. **payments**
Tracks all payment transactions.

**Schema**:
```sql
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  
  plan_name TEXT NOT NULL CHECK (plan_name IN ('Beginner', 'Intermediate', 'Advanced')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  metadata JSONB DEFAULT '{}'::jsonb
);
```

**Indexes**:
- user_id, status, created_at, razorpay_order_id, razorpay_payment_id

**Policies (RLS)**:
- ✅ Users can SELECT their own payments
- ✅ Authenticated users can INSERT payments
- ✅ Service role can UPDATE

#### 3. **subscriptions**
Tracks active user subscriptions.

**Schema**:
```sql
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  
  plan_name TEXT NOT NULL CHECK (plan_name IN ('Beginner', 'Intermediate', 'Advanced')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  
  status TEXT NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  next_renewal_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  payment_id UUID REFERENCES public.payments(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Auto-creation**: Trigger automatically creates/updates subscription when payment status = 'completed'

**Policies (RLS)**:
- ✅ Users can SELECT their own subscription
- ✅ Service role can INSERT/UPDATE

### Database Triggers

#### 1. **handle_new_user()**
Creates profile entry when user signs up.

#### 2. **handle_successful_payment()**
Creates or updates subscription when payment completes:
- Sets status = 'active'
- Sets next_renewal_at = NOW() + 1 month
- Links to payment record

#### 3. **handle_updated_at()**
Auto-updates `updated_at` timestamp on row changes.

---

## 🔐 Authentication System (Supabase Auth)

### Authentication Methods
- Email + Password
- Username + Password (username → email lookup)

### Flow

#### **Signup** (`app/(auth)/signup/page.tsx`)
1. User enters: email, username, password
2. Client validates: email format, username uniqueness
3. Supabase creates auth user
4. Database trigger creates profile entry
5. User auto-logged in
6. Redirect to homepage

#### **Login** (`app/(auth)/login/page.tsx`)
1. User enters: email/username + password
2. If username provided → lookup email from profiles table
3. Supabase signs in with email + password
4. Session stored in HTTP-only cookies
5. Redirect to homepage

#### **Protected Routes** (Middleware)
```typescript
// middleware.ts + app/utils/supabase/middleware.ts
if (!user && request.nextUrl.pathname.startsWith('/play')) {
  return NextResponse.redirect('/login')
}
```

Protected routes:
- ✅ `/play` (requires authentication)

#### **Session Management**
- JWT tokens stored in HTTP-only cookies
- Middleware refreshes session on each request
- `supabase.auth.getUser()` in components
- Auto-logout on token expiration

---

## 💳 Payment System (Razorpay)

### Configuration

**Environment Variables**:
```env
RAZORPAY_KEY_ID=rzp_test_***
RAZORPAY_KEY_SECRET=***
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_***
```

### Payment Flow (Detailed)

1. **User Clicks "Buy Now"**
   - Location: `app/(main)/page.tsx`
   - Function: `handlePayment(plan)`

2. **Authentication Check**
   ```typescript
   if (!user) {
     alert('Please sign in to purchase a plan');
     router.push('/login');
     return;
   }
   ```

3. **Create Order** (API: `/api/razorpay/create-order`)
   ```typescript
   // Server-side
   const order = await razorpay.orders.create({
     amount: amount * 100,  // Paise
     currency: 'INR',
     receipt: `${Date.now()}_${user.id}`,
     notes: { plan: planName, user_id: user.id }
   });
   
   // Create pending payment record
   await supabase.from('payments').insert({
     user_id: user.id,
     razorpay_order_id: order.id,
     plan_name: planName,
     amount: amount,
     status: 'pending'
   });
   ```

4. **Open Razorpay Checkout**
   ```typescript
   const options = {
     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
     amount: data.amount,
     currency: data.currency,
     order_id: data.orderId,
     name: 'The Chesseract',
     handler: async function (response) {
       // Verify payment
     }
   };
   const razorpay = new window.Razorpay(options);
   razorpay.open();
   ```

5. **User Completes Payment**
   - Test card: 4111 1111 1111 1111
   - Any CVV, future expiry

6. **Verify Payment** (API: `/api/razorpay/verify-payment`)
   ```typescript
   // HMAC-SHA256 signature verification
   const body_data = razorpay_order_id + '|' + razorpay_payment_id;
   const expected_signature = crypto
     .createHmac('sha256', RAZORPAY_KEY_SECRET)
     .update(body_data)
     .digest('hex');
   
   if (expected_signature === razorpay_signature) {
     // Update payment to 'completed'
     await supabase.from('payments').update({
       status: 'completed',
       paid_at: new Date().toISOString(),
       razorpay_payment_id,
       razorpay_signature
     }).eq('razorpay_order_id', razorpay_order_id);
     
     // Database trigger auto-creates subscription
   }
   ```

7. **Page Reload**
   - Navbar fetches updated subscription
   - Displays plan name below username

### Security Measures
- ✅ Server-side order creation (API keys never exposed)
- ✅ HMAC-SHA256 signature verification
- ✅ User authentication required
- ✅ Database constraints (foreign keys, CHECK)
- ✅ Row Level Security policies

---

## 🎮 Chess Game Logic

### Core Components

#### 1. **useBoardState.ts**
Manages board state and piece positions.

**Functions**:
- `createInitialBoard()`: Sets up starting position
- `makeMove(from, to)`: Moves piece, returns captured piece
- `resetBoard()`: Reset to starting position
- `clearBoard()`: Empty board

**Castling Support**: Detects king moving 2 squares and moves rook

#### 2. **useGameLogic.ts**
Validates moves and checks game status.

**Functions**:
- `calculateValidMoves(position)`: Returns array of legal moves
- `checkGameStatus()`: Returns 'playing' | 'check' | 'checkmate' | 'stalemate'
- `isMoveLegal(from, to)`: Validates move legality

#### 3. **chessLogic.ts**
Core move validation rules.

**Functions**:
- `isValidMove()`: Checks if move follows piece rules
- `isLegalMove()`: Checks if move leaves king in check
- `isKingInCheck()`: Detects if king is under attack
- `isCheckmate()`: Checks if king has no legal moves
- `isStalemate()`: Checks for stalemate condition
- `isPathClear()`: Validates no pieces block path (bishop/rook/queen)
- `canCastle()`: Validates castling legality

**Move Rules**:
- ♙ Pawn: 1 forward (2 from start), diagonal capture
- ♘ Knight: L-shape (2+1 squares)
- ♗ Bishop: Diagonal unlimited
- ♜ Rook: Horizontal/vertical unlimited
- ♛ Queen: Bishop + Rook
- ♚ King: 1 square any direction, castling (2 squares)

#### 4. **useMoveHistory.ts**
Tracks and displays moves in algebraic notation.

**Format**:
```
1. e4    e5
2. Nf3   Nc6
3. Bb5   a6
```

#### 5. **useArrows.ts**
Draws arrows on chess board (right-click drag).

**Colors**:
- Default: Yellow/orange arrows
- Used for analysis and move suggestions

#### 6. **sounds.ts**
Sound effects manager.

**Sounds**:
- Move piece
- Capture piece
- Check
- Game end

---

## 🌐 Deployment Architecture

### Frontend (Vercel)

**Platform**: Vercel  
**Framework**: Next.js 14 (App Router)  
**Build Command**: `npm run build`  
**Output Directory**: `.next`  
**Node Version**: 20.x  

**Environment Variables** (Vercel Dashboard):
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx

# WebSocket
NEXT_PUBLIC_SOCKET_URL=http://your-ec2-ip:3001
```

**Deployment**:
- Automatic deployment on git push to main
- Zero-downtime deployments
- Edge functions for API routes

**Vercel Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "routes": [
    {
      "src": "/api/socket",
      "dest": "/api/socket",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
      }
    }
  ]
}
```

### WebSocket Server (AWS EC2)

**Instance Type**: t2.micro (or higher)  
**OS**: Amazon Linux 2  
**Port**: 3001  
**Process Manager**: PM2  

**Setup Steps**:
1. SSH into EC2
2. Install Node.js: `sudo yum install nodejs`
3. Install PM2: `npm install -g pm2`
4. Clone/upload server code
5. Install dependencies: `npm install`
6. Start server: `pm2 start index.ts --name chesseract-server --interpreter ts-node`
7. Save PM2 list: `pm2 save`
8. Enable auto-start: `pm2 startup`

**Security Group**:
- Inbound Rule: TCP port 3001 (from 0.0.0.0/0)
- Outbound Rule: All traffic

**PM2 Ecosystem** (optional `ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'chesseract-server',
    script: 'index.ts',
    interpreter: 'ts-node',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

**Logs**:
```bash
pm2 logs chesseract-server --lines 50
```

### Database (Supabase)

**Platform**: Supabase Cloud  
**Database**: PostgreSQL 15.x  
**Region**: Choose closest to users  

**Configuration**:
- ✅ Row Level Security enabled
- ✅ Realtime disabled (not needed)
- ✅ Auto-backups enabled
- ✅ SSL enforced

**Connection Pooling**: Enabled (for high traffic)

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Git

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/the-chesseract.git
   cd the-chesseract
   ```

2. **Install Dependencies**
   ```bash
   # Frontend
   npm install
   
   # WebSocket Server
   cd server
   npm install
   cd ..
   ```

3. **Environment Variables**
   Create `.env.local` in root:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # Razorpay
   RAZORPAY_KEY_ID=rzp_test_xxx
   RAZORPAY_KEY_SECRET=xxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
   
   # WebSocket
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   ```

4. **Database Setup**
   - Create Supabase project
   - Run migrations in SQL Editor:
     - `database/supabase-profiles-schema.sql` (profiles table)
     - `database/supabase-payments-schema.sql` (payments/subscriptions)

5. **Start Development Servers**
   
   **Option A: Automated Script**
   ```bash
   chmod +x start-dev.sh
   ./start-dev.sh
   ```
   
   **Option B: Manual**
   ```bash
   # Terminal 1: WebSocket Server
   cd server
   npm run dev
   
   # Terminal 2: Next.js
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - WebSocket: http://localhost:3001
   - Play Chess: http://localhost:3000/play

---

## 📦 Dependencies

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "@supabase/ssr": "^0.7.0",
    "@supabase/supabase-js": "^2.78.0",
    "next": "^14.2.28",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "socket.io-client": "^4.7.4",
    "razorpay": "^2.9.6",
    "lucide-react": "^0.344.0",
    "tailwindcss": "^3.0.0",
    "typescript": "^5.0.0",
    "uuid": "^11.1.0",
    "nodemailer": "^7.0.9"
  }
}
```

### WebSocket Server (`server/package.json`)
```json
{
  "dependencies": {
    "socket.io": "^4.6.1",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/uuid": "^9.0.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.0.0"
  }
}
```

---

## 🎯 Key Features Summary

### ✅ Implemented Features

**Authentication**:
- ✅ Email/password signup
- ✅ Username/email login
- ✅ Session management with JWT
- ✅ Protected routes via middleware
- ✅ Profile creation on signup

**Chess Gameplay**:
- ✅ Real-time multiplayer
- ✅ Automatic matchmaking
- ✅ 10-minute timers
- ✅ Legal move validation
- ✅ Check/checkmate detection
- ✅ Reconnection support (60s grace)
- ✅ Move history
- ✅ Captured pieces display
- ✅ Sound effects
- ✅ Draw arrows
- ✅ Resign/draw options

**Payment System**:
- ✅ Razorpay integration
- ✅ 3 subscription plans
- ✅ Authentication required
- ✅ Secure signature verification
- ✅ Database tracking
- ✅ Auto-subscription creation
- ✅ Plan display in navbar

**Other Features**:
- ✅ Chess analysis tool
- ✅ Chess board editor
- ✅ Course pages
- ✅ Coach profiles
- ✅ Contact form
- ✅ Blog system
- ✅ Responsive design
- ✅ Modern UI (glassmorphism)

### 🚧 Future Enhancements

**Chess Features**:
- [ ] Computer AI opponent (Stockfish integration)
- [ ] Opening book database
- [ ] Puzzle trainer
- [ ] Tournament system
- [ ] Rating system (ELO)
- [ ] Game analysis with engine
- [ ] Save/load games (PGN format)

**Payment & Subscriptions**:
- [ ] Subscription cancellation
- [ ] Plan upgrade/downgrade
- [ ] Payment history page
- [ ] Invoice generation (PDF)
- [ ] Razorpay webhooks
- [ ] Email notifications

**Social Features**:
- [ ] Friend system
- [ ] Challenge specific players
- [ ] Chat during games
- [ ] Spectator mode
- [ ] Leaderboards
- [ ] User profiles (public)

**Platform**:
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Email verification
- [ ] Password reset
- [ ] 2FA authentication
- [ ] Admin dashboard

---

## 🐛 Known Issues & Limitations

1. **WebSocket Scaling**:
   - Current: Single EC2 instance
   - Limitation: ~100-500 concurrent connections
   - Solution: Use Redis for session sharing + load balancer

2. **No Game Persistence**:
   - Games only stored in memory
   - Solution: Save games to database

3. **No Draw Acceptance Flow**:
   - Draw offer sends event but no acceptance UI
   - Solution: Add modal for opponent to accept/decline

4. **No En Passant**:
   - Special pawn capture not implemented
   - Solution: Add en passant logic to move validation

5. **No Promotion**:
   - Pawn reaching back rank doesn't promote
   - Solution: Add promotion modal to select piece

6. **Timer Desync**:
   - Slight time differences between client/server
   - Solution: Use server as source of truth, sync every 500ms

---

## 📊 Analytics & Monitoring

### Recommended Tools

**Frontend (Vercel)**:
- Vercel Analytics (built-in)
- Google Analytics
- Sentry (error tracking)

**Backend (EC2)**:
- PM2 monitoring
- CloudWatch logs
- Custom metrics API

**Database (Supabase)**:
- Supabase Dashboard (queries, slow queries)
- Row-level metrics

---

## 🔒 Security Considerations

### Current Security Measures

1. **Authentication**:
   - ✅ HTTP-only cookies (XSS protection)
   - ✅ JWT token expiration
   - ✅ Password hashing (Supabase)
   - ✅ CSRF protection (SameSite cookies)

2. **Database**:
   - ✅ Row Level Security (RLS)
   - ✅ Foreign key constraints
   - ✅ Input validation (CHECK constraints)
   - ✅ SQL injection prevention (parameterized queries)

3. **Payments**:
   - ✅ Server-side signature verification
   - ✅ No secret keys in client
   - ✅ Amount verification
   - ✅ User authentication required

4. **API**:
   - ✅ Rate limiting (Vercel default)
   - ✅ CORS configured
   - ✅ Authentication checks

### Recommendations

1. **Add**: Content Security Policy (CSP) headers
2. **Add**: Rate limiting on WebSocket events
3. **Add**: IP-based rate limiting
4. **Add**: Email verification
5. **Add**: Password strength requirements
6. **Add**: Audit logging for payments
7. **Review**: Supabase RLS policies regularly

---

## 📝 API Documentation

### REST APIs

#### `POST /api/razorpay/create-order`
Creates a new Razorpay order and pending payment record.

**Request**:
```json
{
  "amount": 1999,
  "currency": "INR",
  "planName": "Beginner"
}
```

**Response**:
```json
{
  "orderId": "order_xxx",
  "amount": 199900,
  "currency": "INR"
}
```

**Errors**:
- 401: Not authenticated
- 400: Invalid plan name
- 500: Order creation failed

#### `POST /api/razorpay/verify-payment`
Verifies Razorpay payment signature.

**Request**:
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "xxx",
  "planName": "Beginner"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "pay_xxx"
}
```

**Errors**:
- 401: Not authenticated
- 400: Invalid signature
- 500: Database update failed

#### `POST /api/contact`
Sends contact form email.

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

**Response**:
```json
{
  "message": "Email sent successfully"
}
```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication**:
- [ ] Sign up with new account
- [ ] Login with email
- [ ] Login with username
- [ ] Access /play without login (should redirect)
- [ ] Logout

**Chess Game**:
- [ ] Find game (should match two players)
- [ ] Make legal moves
- [ ] Try illegal move (should be prevented)
- [ ] Timer counts down
- [ ] Resign game
- [ ] Reconnect (refresh page during game)

**Payment**:
- [ ] Buy plan without login (should redirect)
- [ ] Buy plan with login
- [ ] Complete payment (test card)
- [ ] Check navbar shows plan
- [ ] Verify database records

### Test Cards (Razorpay)

| Card Number | Description |
|-------------|-------------|
| 4111 1111 1111 1111 | Success |
| 4012 8888 8888 1881 | Success |
| 5555 5555 5555 4444 | Failed |

Any CVV, any future expiry date.

---

## 📚 Resources & Documentation

### External Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Socket.io Docs](https://socket.io/docs/v4/)
- [Razorpay API Docs](https://razorpay.com/docs/api/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Internal Documentation
- `README.md` - Project overview and quick start
- `current_implementation.md` - Complete implementation guide (this document)
- `database/` - SQL schema files

---

## 🎓 Learning Resources

### Chess Programming
- [Chess Programming Wiki](https://www.chessprogramming.org/)
- [Stockfish Source Code](https://github.com/official-stockfish/Stockfish)

### WebSocket Best Practices
- [Socket.io Performance Tips](https://socket.io/docs/v4/performance-tuning/)

### Supabase Patterns
- [Supabase RLS Examples](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🙋 Support & Contact

### Common Issues

**"WebSocket connection failed"**:
- Check if server is running on EC2
- Verify port 3001 is open
- Check NEXT_PUBLIC_SOCKET_URL is correct

**"Authentication required"**:
- Clear cookies and log in again
- Check Supabase credentials in .env

**"Payment verification failed"**:
- Check Razorpay secret key is correct
- Verify signature calculation

### Getting Help
1. Check logs: `pm2 logs` (server), browser console (client)
2. Review Supabase logs in dashboard
3. Test with curl/Postman for API issues

---

## 📈 Future Roadmap

### Phase 1 (Current)
- ✅ Basic chess gameplay
- ✅ Authentication
- ✅ Payment integration

### Phase 2 (Next 3 months)
- [ ] Computer AI opponent
- [ ] Save/load games
- [ ] Game analysis
- [ ] User profiles

### Phase 3 (6-12 months)
- [ ] Tournament system
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Social features

---

## 📄 License

MIT License

---

**Document Version**: 1.0  
**Last Updated**: November 5, 2025  
**Maintained By**: Development Team

---

## 🎯 Quick Reference

### URLs
- **Production**: https://the-chesseract.vercel.app
- **WebSocket**: http://your-ec2-ip:3001
- **Supabase**: https://app.supabase.com

### Commands
```bash
# Development
npm run dev                   # Start Next.js
cd server && npm run dev      # Start WebSocket
./start-dev.sh               # Start both

# Deployment
git push origin main         # Deploy to Vercel
pm2 restart all              # Restart WebSocket

# Logs
pm2 logs --lines 50          # Server logs
vercel logs                  # Vercel logs
```

### Tech Stack at a Glance
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind
- **Backend**: Node.js + Socket.io + ts-node
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (JWT)
- **Payments**: Razorpay
- **Hosting**: Vercel (frontend) + AWS EC2 (WebSocket)

---

**End of Document**
