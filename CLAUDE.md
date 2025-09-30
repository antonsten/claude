# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Anton Sten (antonsten.com) - a UX Lead & Product Designer with 25+ years of experience. Built with Astro and Tailwind CSS, deployed on Netlify. Includes a digital product sales system with Lemon Squeezy and Stripe integration for e-book sales.

## Development Commands

```bash
# Development
npm run dev                    # Start dev server at http://localhost:4321

# Build
npm run build                  # Standard build
npm run build:full             # Build with OG image generation
npm run preview                # Preview production build locally

# Utilities
npm run generate-og-images     # Generate Open Graph images for articles
npm run add-slugs              # Add slugs to content files
```

## Architecture

### Content System

- **Content Collections**: Articles stored in `src/content/articles/` as MDX files with frontmatter
- **Schema**: Defined in `src/content/config.ts` with Zod validation for articles, testimonials, and other content types
- **Frontmatter fields**: title, description, date, readingTime, slug, image (all optional except title)

### Page Structure

- **Layouts**:
  - `BaseLayout.astro`: Base HTML structure
  - `BlogPost.astro`: Article/blog post layout
  - `Layout.astro`: General page layout
- **File-based routing**: Pages in `src/pages/` map directly to URLs
- **API Routes**: Located in `src/pages/api/` for webhook handling (Lemon Squeezy, Stripe, ConvertKit)

### Database

- **ORM**: Drizzle ORM with SQLite
- **Location**: `data/local.db`
- **Schema**: `src/db/schema.ts` defines users, sessions, installations, and repositories tables
- **Authentication**: Custom auth implementation in `src/lib/auth.ts` and GitHub integration in `src/lib/github.ts`

### Styling

- **Framework**: Tailwind CSS with custom theme
- **Typography**:
  - Sans: "Suisse Intl"
  - Serif: "Blanco"
- **Dark mode**: Class-based dark mode with custom color palette
- **Custom colors**: black (#131313), green (#00A35C), light-grey (#F3F3F1), and dark mode variants
- **Important**: Never use Tailwind's `@apply` directive

### Components

Key reusable components in `src/components/`:
- `OptimizedImage.astro`: Image optimization wrapper
- `NewsletterForm.astro`: Newsletter signup form
- `BookSampleForm.astro`: Book sample request form
- `Navigation.astro`: Site navigation
- `Footer.astro`: Site footer
- `HtmlHead.astro`: SEO and meta tags
- `PersonSchema.astro`: Structured data for person/author
- `JsonLd.astro`: Generic JSON-LD schema component

### Scripts

The `scripts/` directory contains numerous utility scripts for content management:
- Image processing and optimization (WebP conversion, dimensions, lazy loading)
- Open Graph image generation using Sharp
- Content migration from Ghost CMS and other sources
- Notion integration for content syncing

### Digital Sales System

- **Payment processors**: Lemon Squeezy (primary) and Stripe
- **Email marketing**: ConvertKit integration for automated customer emails
- **Webhooks**: Real-time order fulfillment via API routes
- **Analytics**: Fathom Analytics for purchase tracking
- See `docs/DIGITAL_SALES_SETUP.md` for detailed setup instructions (if it exists)

## Key Conventions

1. **Static-first**: Leverage Astro's static generation; minimize client-side JavaScript
2. **Component hydration**: Use `client:*` directives sparingly and appropriately:
   - `client:load` - immediately needed interactivity
   - `client:idle` - non-critical interactivity
   - `client:visible` - hydrate when visible
3. **TypeScript**: Use TypeScript for type safety throughout
4. **Responsive design**: Mobile-first approach with Tailwind's responsive utilities
5. **Accessibility**: Semantic HTML and proper ARIA attributes
6. **Image optimization**: Always use `OptimizedImage.astro` or Astro's Image component
7. **SEO**: Implement canonical URLs, proper meta tags, and structured data

## Content Workflow

1. Articles are written as MDX files in `src/content/articles/`
2. Frontmatter includes metadata (title, date, slug, etc.)
3. OG images can be generated automatically with `npm run generate-og-images`
4. Content schema is validated via Zod in `src/content/config.ts`

## Deployment

- **Platform**: Netlify
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Node version**: 20
- **Framework detection**: Astro (automatic dev server on port 4321)