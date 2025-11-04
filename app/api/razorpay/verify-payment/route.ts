import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
    } = body;

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment parameters' },
        { status: 400 }
      );
    }

    // Verify signature
    const body_data = razorpay_order_id + '|' + razorpay_payment_id;
    const expected_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body_data)
      .digest('hex');

    const isValid = expected_signature === razorpay_signature;

    if (isValid) {
      // Payment is verified successfully
      // Here you can:
      // 1. Update user's subscription in your database
      // 2. Send confirmation email
      // 3. Log the transaction
      
      console.log('Payment verified successfully:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        plan: planName,
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

