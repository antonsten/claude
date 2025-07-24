# Anton Sten Website

This repository contains the source for [antonsten.com](https://www.antonsten.com), the personal site of Anton Sten—UX Lead & Product Designer. The site features his writing, design work and coaching services. It is built with [Astro](https://astro.build) and deployed on Netlify.

## Digital Sales System

The website includes a complete digital product sales system for e-book sales featuring:
- **Stripe Payment Links** for secure checkout processing
- **Automated ConvertKit integration** for customer email management  
- **Webhook processing** for real-time order fulfillment
- **Comprehensive error handling** for high-volume launches

For detailed setup instructions, see [`docs/DIGITAL_SALES_SETUP.md`](docs/DIGITAL_SALES_SETUP.md).

## Development

Install dependencies and start a local dev server:

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:4321`.

## Build

Generate the production output in the `dist` directory:

```bash
npm run build
```

## Preview

Serve the built site locally before deploying:

```bash
npm run preview
```

