import crypto from 'crypto';

// Disable prerendering for this API endpoint
export const prerender = false;

const webhookSecret = import.meta.env.LEMONSQUEEZY_WEBHOOK_SECRET;
const kitApiKey = import.meta.env.KIT_API_KEY;
const kitFormId = import.meta.env.KIT_FORM_ID;

export async function POST({ request }) {
  try {
    console.log('🍋 Lemon Squeezy webhook received');
    console.log('KIT_API_KEY present:', !!kitApiKey, 'KIT_FORM_ID:', kitFormId);
    
    const body = await request.text();
    const signature = request.headers.get('x-signature');

    // Verify webhook signature if secret is provided
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        console.error('❌ Webhook signature verification failed');
        return new Response('Webhook signature verification failed', { status: 400 });
      }
      console.log('✅ Webhook signature verified');
    }

    const event = JSON.parse(body);
    console.log('Lemon Squeezy event payload:', JSON.stringify(event, null, 2));

    // Handle order created event (successful purchase)
    if (event.meta?.event_name === 'order_created') {
      const order = event.data;
      try {
        console.log('🛒 Processing successful order:', order.id);
        
        // Extract customer information
        const customerEmail = order.attributes.user_email;
        const customerName = order.attributes.user_name;
        const productName = order.attributes.first_order_item?.product_name;
        const orderTotal = order.attributes.total;
        
        if (!customerEmail) {
          console.error('❌ No customer email found in order');
          return new Response('No customer email found', { status: 400 });
        }
        
        console.log('📧 Customer email:', customerEmail);
        console.log('📖 Product:', productName);
        console.log('💰 Total:', orderTotal);
        
        // Add customer to Kit with ebook-customer tag
        if (kitApiKey && kitFormId) {
          await addToConvertKit(customerEmail, customerName, productName);
        } else {
          console.log('⚠️ Kit integration not configured, skipping email signup');
        }
        
        console.log('✅ Successfully processed book purchase for:', customerEmail);
      } catch (error) {
        console.error('❌ Error processing order:', error);
        return new Response('Error processing order', { status: 500 });
      }
    } else {
      console.log(`ℹ️ Unhandled event type: ${event.meta?.event_name}`);
    }
    
    return new Response('Success', { status: 200 });
  } catch (err) {
    console.error('🔥 Top-level error in webhook handler:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

async function addToConvertKit(email, name = '', productName = '') {
  try {
    console.log('📬 Adding to Kit using API v4:', email);
    
    // Determine tags based on product
    let tags = ['ebook-customer'];
    if (productName?.toLowerCase().includes('ama')) {
      tags.push('ama-customer');
    }
    
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
        tags: tags
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
    console.log('⚠️ Webhook will still return success despite Kit error');
    throw error;
  }
}
