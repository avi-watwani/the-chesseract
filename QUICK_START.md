# 🚀 Quick Start Guide

## Just 2 Steps to Get Running!

### Step 1: Run Database Migration

1. Open [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Click **SQL Editor** in sidebar
4. Click **New Query**
5. Open `supabase-payments-migration.sql` file
6. Copy ALL the contents and paste into SQL Editor
7. Click **Run** (Cmd/Ctrl + Enter)
8. Wait for "Success" message

### Step 2: Restart Dev Server

```bash
# Press Ctrl+C to stop current server
npm run dev
```

## ✅ That's It!

Now test:
1. Click "Buy Now" on homepage
2. If not logged in → Login prompt appears
3. After login → Razorpay opens
4. Complete payment with test card: `4111 1111 1111 1111`
5. See your plan in navbar! 🎉

---

**Full details:** See `PAYMENT_INTEGRATION_COMPLETE.md`

