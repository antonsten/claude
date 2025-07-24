# Digital Product Sales System Setup

This guide covers setting up the complete digital sales system for your e-book with Stripe payments and ConvertKit email automation.

## Overview

The system includes:
- **Stripe Payment Links** for checkout
- **Webhook endpoint** to process completed payments
- **ConvertKit integration** to automatically add customers to your email list
- **Secure signature verification** for webhook security

## Prerequisites

1. Stripe account with API keys
2. ConvertKit account with API access
3. Existing ConvertKit form for customer collection

## Environment Variables

Add these variables to your `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...           # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...         # Webhook endpoint secret from Stripe dashboard

# ConvertKit Configuration (already configured)
CONVERTKIT_API_KEY=your_api_key         # Your ConvertKit API key
CONVERTKIT_FORM_ID=your_form_id         # ConvertKit form ID for customers
```

## Setup Instructions

### 1. Stripe Configuration

1. **Get API Keys:**
   - Log into your Stripe Dashboard
   - Go to Developers → API keys
   - Copy your secret key (starts with `sk_test_` or `sk_live_`)
   - Add to `STRIPE_SECRET_KEY` environment variable

2. **Create Webhook Endpoint:**
   - Go to Developers → Webhooks in Stripe Dashboard
   - Click "Add endpoint"
   - Set URL to: `https://yourdomain.com/api/stripe-webhook`
   - Select event: `checkout.session.completed`
   - Click "Add endpoint"
   - Copy the webhook secret (starts with `whsec_`)
   - Add to `STRIPE_WEBHOOK_SECRET` environment variable

3. **Create Payment Link:**
   - Go to Products in Stripe Dashboard
   - Create your e-book product
   - Set up a Payment Link for the product
   - Use this link for your sales page

### 2. ConvertKit Configuration

Your Kit is already configured! The webhook will use your existing:
- `KIT_API_KEY` (used as Bearer token for Kit API v4)
- `KIT_FORM_ID`

**API Upgrade:** The system now uses **Kit API v4** (the latest version) which offers:
- Improved performance and reliability
- Better error handling
- Enhanced features for subscriber management
- Future-proof as API v3 is deprecated
- Uses the correct v4 endpoint: `POST https://api.kit.com/v4/subscribers`

New customers will be added with the tag `ebook-customer`.

### 3. Deploy and Test

1. **Deploy your changes:**
   ```bash
   npm run build
   # Deploy to your hosting platform
   ```

2. **Update Stripe webhook URL** to point to your live domain

## Testing

### Local Testing with Stripe CLI

1. **Install Stripe CLI:**
   ```bash
   brew install stripe/stripe-cli/stripe
   # Or download from: https://github.com/stripe/stripe-cli
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local development:**
   ```bash
   stripe listen --forward-to localhost:4321/api/stripe-webhook
   ```

4. **Trigger test event:**
   ```bash
   stripe trigger checkout.session.completed
   ```

### Manual Testing with cURL

Test the webhook endpoint directly:

```bash
# Note: This won't work without proper Stripe signature
curl -X POST http://localhost:4321/api/stripe-webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "test"}'
```

### Production Testing

1. **Create a test product** in Stripe (use test mode)
2. **Complete a test purchase** using test card numbers:
   - Success: `4242424242424242`
   - Failure: `4000000000000002`
3. **Check logs** for webhook processing
4. **Verify customer** appears in ConvertKit with `ebook-customer` tag

## Monitoring and Logs

### Webhook Logs

Monitor webhook processing in your hosting platform's logs. Look for:
- `✅ Webhook signature verified`
- `🛒 Processing completed checkout session`
- `✅ Successfully added to ConvertKit`

### Stripe Dashboard

Monitor webhook attempts in Stripe Dashboard:
- Go to Developers → Webhooks
- Click on your webhook endpoint
- View recent attempts and responses

### ConvertKit Verification

Check new subscribers in ConvertKit:
- Go to Subscribers
- Filter by tag `ebook-customer`
- Verify new customers are being added

## Error Handling

The webhook includes comprehensive error handling:

1. **Signature Verification:** Returns 400 if webhook signature is invalid
2. **Missing Email:** Returns 400 if no customer email in Stripe session
3. **ConvertKit Errors:** Logs error but doesn't fail webhook (returns 200)
4. **Processing Errors:** Returns 500 for unexpected errors

## Security Features

- **Webhook signature verification** prevents unauthorized requests
- **Environment variable isolation** keeps secrets secure
- **Comprehensive logging** for audit trail
- **Graceful error handling** prevents system failures

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails:**
   - Check `STRIPE_WEBHOOK_SECRET` environment variable
   - Ensure webhook URL matches exactly in Stripe dashboard

2. **Kit API errors:**
   - Verify `KIT_API_KEY` and `KIT_FORM_ID`
   - Check Kit API status
   - Test with the existing `/api/test-convertkit` endpoint
   - Note: Now using Kit API v4 with Bearer token authentication

3. **Missing environment variables:**
   - Ensure all required variables are set in production
   - Restart your application after adding variables

4. **Webhook not receiving events:**
   - Check Stripe webhook dashboard for delivery attempts
   - Verify webhook URL is accessible publicly
   - Check hosting platform logs

### Debug Commands

```bash
# Test Kit v4 connection
curl https://yourdomain.com/api/test-convertkit

# Check webhook endpoint is accessible
curl https://yourdomain.com/api/stripe-webhook

# View recent webhook attempts in Stripe CLI
stripe logs tail
```

## Expected Volume Handling

The system is designed for high volume during launch week:
- **Asynchronous processing** prevents blocking
- **Graceful error handling** maintains system stability
- **Comprehensive logging** for monitoring
- **Webhook retry logic** handled by Stripe automatically

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review hosting platform logs
3. Check Stripe webhook dashboard
4. Test ConvertKit connection with existing endpoint

---

**Next Steps:** Once configured, create your Stripe Payment Link and integrate it into your sales page! 