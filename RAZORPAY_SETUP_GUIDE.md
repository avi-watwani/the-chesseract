# Razorpay Integration Setup Guide

## ✅ Completed Steps

1. ✅ Installed Razorpay SDK (`npm install razorpay`)
2. ✅ Created API routes for order creation and payment verification
3. ✅ Updated homepage with "Buy Now" buttons (removed "Book a Demo" buttons)
4. ✅ Added Razorpay checkout script to the app layout
5. ✅ Implemented client-side payment handlers

## 🔧 Required Actions (Do These Now)

### Step 1: Get Your Razorpay API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to: **Settings** → **API Keys** → **Website and App Settings**
3. Generate/Copy your:
   - **Key ID** (starts with `rzp_test_` for test mode or `rzp_live_` for production)
   - **Key Secret** (keep this secret!)

### Step 2: Create Environment Variables File

Create a file named `.env.local` in the root of your project with the following content:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE

# This should be accessible on the client side (starts with NEXT_PUBLIC_)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
```

**Important Notes:**
- Replace `YOUR_KEY_ID_HERE` and `YOUR_KEY_SECRET_HERE` with your actual Razorpay credentials
- Use **test mode** keys (starting with `rzp_test_`) for development
- Use **live mode** keys (starting with `rzp_live_`) for production
- The `.env.local` file is already in `.gitignore`, so it won't be committed to git

### Step 3: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the homepage: `http://localhost:3000`

3. Click on any "Buy Now" button for a plan

4. The Razorpay checkout modal should open with:
   - Your plan details
   - Payment options
   - Test card details for testing

### Step 4: Test Mode Payment Credentials

For testing in **test mode**, use these test card details:

**Test Card Details:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Test UPI ID:**
- UPI ID: `success@razorpay`

**Test Wallets:**
- All wallets work in test mode

## 📁 Files Created/Modified

### New Files:
1. `/app/api/razorpay/create-order/route.ts` - API endpoint to create Razorpay orders
2. `/app/api/razorpay/verify-payment/route.ts` - API endpoint to verify payments

### Modified Files:
1. `/app/(main)/page.tsx` - Updated with Buy Now buttons and payment handlers
2. `/app/layout.tsx` - Added Razorpay checkout script
3. `/package.json` - Added Razorpay dependency

## 🔄 How It Works

1. **User clicks "Buy Now"** → Triggers `handlePayment()` function
2. **Create Order** → Calls `/api/razorpay/create-order` to create a Razorpay order
3. **Open Checkout** → Opens Razorpay checkout modal with order details
4. **User Pays** → User completes payment using their preferred method
5. **Verify Payment** → Calls `/api/razorpay/verify-payment` to verify the payment signature
6. **Success/Failure** → Shows appropriate message to user

## 💳 Payment Plans Configured

| Plan | Price | Currency |
|------|-------|----------|
| Beginner | $89/mo | USD |
| Intermediate | $149/mo | USD |
| Advanced | $249/mo | USD |

## 🔐 Security Features Implemented

1. ✅ **Signature Verification** - All payments are verified using HMAC SHA256
2. ✅ **Server-side Validation** - Orders are created on the server, not client
3. ✅ **Environment Variables** - Sensitive keys are stored in environment variables
4. ✅ **Client/Server Separation** - Key Secret is never exposed to the client

## 🚀 Going Live

When you're ready to accept real payments:

1. Complete Razorpay KYC verification
2. Switch to **Live Mode** in Razorpay Dashboard
3. Generate **Live API Keys** (start with `rzp_live_`)
4. Update `.env.local` with live keys:
   ```env
   RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
   ```
5. Test thoroughly before deploying
6. Deploy to production

## 🎨 Currency Customization

Currently set to **USD**. To change to INR or other currencies:

In `/app/(main)/page.tsx`, update the `currency` field:

```typescript
handlePayment({
  name: 'Beginner',
  amount: 89,
  currency: 'INR', // Change this to your preferred currency
  description: 'Perfect for beginners starting their chess journey'
})
```

**Important:** For INR, amounts are in rupees (e.g., 89 = ₹89)

## 📝 Next Steps (Optional Enhancements)

1. **Database Integration** - Store payment records in Supabase
2. **Email Notifications** - Send confirmation emails after successful payment
3. **User Dashboard** - Show subscription status in user profile
4. **Webhooks** - Set up Razorpay webhooks for automatic payment updates
5. **Subscription Management** - Implement recurring payments using Razorpay Subscriptions
6. **Invoice Generation** - Auto-generate invoices for payments

## 🆘 Troubleshooting

### Error: "Razorpay is not defined"
- Make sure the Razorpay script is loaded. Check browser console.
- The script loads lazily, wait a moment after page load.

### Error: "Failed to create order"
- Check if `.env.local` file exists and has correct keys
- Verify environment variables are set: `console.log(process.env.RAZORPAY_KEY_ID)`
- Restart your dev server after adding environment variables

### Payment succeeds but verification fails
- Check if `RAZORPAY_KEY_SECRET` in `.env.local` matches your Razorpay dashboard
- Ensure you're using the same mode (test/live) for both keys

### Amount is incorrect in checkout
- Razorpay uses smallest currency unit (paise for INR, cents for USD)
- $89 is sent as 8900 cents automatically in the code
- Check the `amount * 100` multiplication in create-order route

## 📞 Support

- **Razorpay Documentation:** https://razorpay.com/docs/
- **API Reference:** https://razorpay.com/docs/api/
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/

---

**Status:** Ready for testing after completing Step 2 (environment variables) ✨

