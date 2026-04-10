import { createRequestHandler } from 'expo-router/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const signature = request.headers.get('x-paystack-signature');

    // TODO: Verify Paystack signature
    // const isValid = verifyPaystackSignature(JSON.stringify(payload), signature);

    // Handle Paystack webhook events
    const { event, data } = payload;

    switch (event) {
      case 'charge.success':
        // Update booking payment status
        console.log('Payment successful:', data.reference);
        break;
      case 'charge.failed':
        console.log('Payment failed:', data.reference);
        break;
      case 'transfer.success':
        console.log('Transfer successful:', data.reference);
        break;
      case 'transfer.failed':
        console.log('Transfer failed:', data.reference);
        break;
      default:
        console.log('Unhandled Paystack event:', event);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
