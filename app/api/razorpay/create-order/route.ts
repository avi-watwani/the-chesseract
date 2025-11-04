import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/app/utils/supabase/server';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to purchase a plan.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, currency, planName } = body;

    // Validate input
    if (!amount || !currency || !planName) {
      return NextResponse.json(
        { error: 'Amount, currency, and plan name are required' },
        { status: 400 }
      );
    }

    // Validate plan name
    const validPlans = ['Beginner', 'Intermediate', 'Advanced'];
    if (!validPlans.includes(planName)) {
      return NextResponse.json(
        { error: 'Invalid plan name' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise (smallest currency unit)
      currency: currency,
      receipt: `${Date.now()}_${user.id.slice(0, 12)}`, // Max 40 chars (Razorpay limit)
      notes: {
        plan: planName,
        user_id: user.id,
        user_email: user.email,
      },
    };

    const order = await razorpay.orders.create(options);

    // Create pending payment record in database
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        razorpay_order_id: order.id,
        plan_name: planName,
        amount: amount,
        currency: currency,
        status: 'pending',
      });

    if (dbError) {
      console.error('Error creating payment record:', dbError);
      // Continue anyway - payment can be reconciled later
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

