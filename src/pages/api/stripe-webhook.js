// DEPRECATED: This webhook is for legacy Stripe payments
// New book purchases now use Lemon Squeezy - see lemonsqueezy-webhook.js
import Stripe from 'stripe';

// Disable prerendering for this API endpoint
export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;
const kitApiKey = import.meta.env.KIT_API_KEY;
const kitFormId = import.meta.env.KIT_FORM_ID || import.meta.env.CONVERTKIT_FORM_ID;

export async function POST({ request }) {
  try {
    console.log('🔔 Stripe webhook received');
    console.log('KIT_API_KEY present:', !!kitApiKey, 'KIT_FORM_ID:', kitFormId);
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified');
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
    console.log('Stripe event type:', event.type);
    console.log('Stripe event payload:', JSON.stringify(event, null, 2));

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      try {
        console.log('🛒 Processing completed checkout session:', session.id);
        // Extract customer information
        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerName = session.customer_details?.name;
        if (!customerEmail) {
          console.error('❌ No customer email found in session');
          return new Response('No customer email found', { status: 400 });
        }
        console.log('Session object:', JSON.stringify(session, null, 2));
        console.log('Extracted customer email:', customerEmail);
        console.log('📧 Customer email:', customerEmail);
        // Add customer to Kit with ebook-customer tag
        await addToConvertKit(customerEmail, customerName);
        console.log('✅ Successfully processed ebook purchase for:', customerEmail);
      } catch (error) {
        console.error('❌ Error processing checkout session:', error);
        return new Response('Error processing checkout', { status: 500 });
      }
    } else {
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
    return new Response('Success', { status: 200 });
  } catch (err) {
    console.error('🔥 Top-level error in webhook handler:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

async function addToConvertKit(email, name = '') {
  try {
    console.log('📬 Adding to Kit using API v4:', email);
    // Add subscriber using Kit API v4 with the correct endpoint and header
    const response = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': kitApiKey,
      },
      body: JSON.stringify({
        email: email,
        first_name: name ? name.split(' ')[0] : '',
        form_id: kitFormId,
        tags: ['ebook-customer']
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Kit API v4 error: ${data.message || response.statusText}`);
    }
    console.log('✅ Successfully added to Kit v4:', data);
    return data;
  } catch (error) {
    console.error('❌ Kit API v4 error:', error);
    // Don't fail the webhook for Kit errors
    // Log the error but continue processing
    console.log('⚠️ Webhook will still return success despite Kit error');
    throw error;
  }
} 