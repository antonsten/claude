#!/usr/bin/env node

/**
 * Quick test for webhook functionality
 * Tests both the webhook endpoint and ConvertKit connection
 */

import fetch from 'node-fetch';

const baseUrl = 'http://localhost:4321';

async function testEndpoints() {
  console.log('🚀 Running quick tests...\n');

  // Test 1: ConvertKit connection
  console.log('1️⃣ Testing ConvertKit connection...');
  try {
    const ckResponse = await fetch(`${baseUrl}/api/test-convertkit`);
    const ckData = await ckResponse.json();
    console.log(ckResponse.ok ? '✅ ConvertKit OK' : '❌ ConvertKit failed');
    if (!ckResponse.ok) console.log('   Error:', ckData.message);
  } catch (error) {
    console.log('❌ ConvertKit connection failed:', error.message);
  }

  console.log('');

  // Test 2: Webhook endpoint availability
  console.log('2️⃣ Testing webhook endpoint...');
  try {
    const webhookResponse = await fetch(`${baseUrl}/api/stripe-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    
    console.log(webhookResponse.status === 400 ? 
      '✅ Webhook endpoint responding (signature verification working)' : 
      '❌ Unexpected webhook response'
    );
  } catch (error) {
    console.log('❌ Webhook endpoint failed:', error.message);
  }

  console.log('\n🏁 Quick test complete!');
  console.log('💡 For full webhook testing, use: node scripts/test-webhook.js');
}

testEndpoints(); 