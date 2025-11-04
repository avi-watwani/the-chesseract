import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
    } = body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      planName: string;
    };

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment parameters' },
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
      // Payment is verified successfully - update database
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
          status: 'completed',
          paid_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', razorpay_order_id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating payment record:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update payment record' },
          { status: 500 }
        );
      }

      // The database trigger will automatically create/update the subscription
      console.log('Payment verified and stored successfully:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        plan: planName,
        userId: user.id,
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
      });
    } else {
      // Invalid signature - mark payment as failed
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          razorpay_payment_id: razorpay_payment_id,
        })
        .eq('razorpay_order_id', razorpay_order_id)
        .eq('user_id', user.id);

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

