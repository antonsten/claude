#!/usr/bin/env node

/**
 * Test script for Stripe webhook endpoint
 * 
 * This script helps test the webhook endpoint locally without needing
 * actual Stripe events or signature verification.
 * 
 * Usage:
 *   node scripts/test-webhook.js
 */

import fetch from 'node-fetch';

const WEBHOOK_URL = 'http://localhost:4321/api/stripe-webhook';

// Sample Stripe checkout.session.completed event payload
const sampleEvent = {
  "id": "evt_test_webhook",
  "object": "event",
  "api_version": "2020-08-27",
  "created": Date.now(),
  "data": {
    "object": {
      "id": "cs_test_session_12345",
      "object": "checkout.session",
      "customer_details": {
        "email": "test@example.com",
        "name": "Test Customer"
      },
      "payment_status": "paid",
      "status": "complete"
    }
  },
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": null,
    "idempotency_key": null
  },
  "type": "checkout.session.completed"
};

async function testWebhook() {
  console.log('🧪 Testing Stripe webhook endpoint...');
  console.log('📧 Test customer email:', sampleEvent.data.object.customer_details.email);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: In production, this requires proper Stripe signature
        'stripe-signature': 'test_signature_for_local_testing'
      },
      body: JSON.stringify(sampleEvent)
    });

    const responseText = await response.text();
    
    console.log('📊 Response status:', response.status);
    console.log('📄 Response body:', responseText);
    
    if (response.ok) {
      console.log('✅ Webhook test completed successfully!');
    } else {
      console.log('❌ Webhook test failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
    console.log('💡 Make sure your development server is running on localhost:4321');
  }
}

// Run the test
testWebhook(); 