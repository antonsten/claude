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

### Design System Baseline (2025 Refresh)

- **Color tokens**: `background #F3F3F1`, `surface #FFFFFF`, `surface-elevated #FFFFFF`, `border #D4D4D0`, `border-strong #5B5B5B`, `text #131313`, `text-muted #5B5B5B`, `text-soft #8C8C87`, `accent #00A35C`, `accent-soft #D1E8BD`
- **Dark mode tokens**: `background #131313`, `surface #1B1B1B`, `surface-elevated #242424`, `border #444444`, `border-strong #8C8C8C`, `text #F3F3F1`, `text-muted #D1E8BD`, `text-soft #A8A8A8`, `accent #00A35C`, `accent-soft #214435`
- **Type scale**: `h1 60/64 -3%`, `h2 26/32 -1%`, `h3 22/30 -1%`, `h4 20/26 -1%`, `body-sm 14/20 -1%`, `body 16/24 -1%`, `body-lg 18/26 -1%`, `body-xl 22/32 -1%`, captions uppercase with 0.08em tracking
- **Spacing rhythm**: 8px increments, with Tailwind extensions for 18, 22, 26, 30 (4.5–7.5rem)
- **Component cues**: Rounded 4px minimum, pill buttons, no shadows, rely on contrast/background layering

### Component Architecture

Components follow a modular, composition-based architecture organized into clear categories:

#### Component Organization

```
src/components/
├── ui/                     # Reusable UI primitives
│   └── Button.astro       # Polymorphic button (primary, secondary, ghost variants)
├── books/                 # Book-specific content
│   └── ProductsPeopleContent.astro
├── Layout components      # Page structure
│   ├── Navigation.astro
│   ├── LeftNavigation.astro
│   ├── Footer.astro
│   └── Header.astro
├── Form components        # Interactive forms
│   ├── NewsletterForm.astro
│   └── BookSampleForm.astro
├── Content components     # Page sections
│   ├── CalloutSection.astro  # Foundation component for highlighted content
│   ├── BookCallout.astro
│   ├── Testimonial.astro
│   └── HomeTestimonial.astro
├── SEO/Meta components
│   ├── HtmlHead.astro
│   ├── PersonSchema.astro
│   ├── ArticleSchema.astro
│   ├── JsonLd.astro
│   └── CanonicalUrl.astro
└── Media components
    ├── OptimizedImage.astro
    ├── MDXImage.astro
    ├── YouTube.astro
    └── SvgLogo.astro
```

#### Component Patterns

**TypeScript Props Interface:**
All components use explicit TypeScript interfaces with proper defaults:
```astro
interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}
const { title, variant = 'primary', className = '' } = Astro.props as Props;
```

**Composition Over Inheritance:**
Components build on each other for flexibility:
- `BookCallout` = `CalloutSection` + `Button`
- `NewsletterForm` = `CalloutSection` + `Button` + form elements
- Foundation components (CalloutSection, Button) are highly reusable

**Flexible Styling:**
- Tailwind utilities for most styling (never use @apply)
- CSS custom properties for dynamic theming (dark mode)
- `className` prop for extending styles from parent
- Scoped `<style>` blocks when needed

**Slot-Based Content:**
Components use default and named slots for maximum flexibility:
```astro
<slot /> <!-- Default content -->
<slot name="title" /> <!-- Named slots -->
```

**State Management (Interactive Components):**
- DOM selection via `getElementById`/`querySelector`
- Class toggles for visibility: `.hidden`, `.is-visible`
- Data attributes for semantic state: `data-state="success"`
- Proper TypeScript assertions: `as HTMLFormElement | null`

**Accessibility:**
- Semantic HTML (`<header>`, `<nav>`, `<section>`)
- ARIA attributes: `aria-label`, `aria-expanded`, `aria-current`
- Focus management and focus-visible states
- Proper button/link semantics

#### Data Layer

- **Centralized data**: `src/data/testimonials.ts` exports typed testimonial data
- **Content collections**: Articles, testimonials use Zod schemas in `src/content/config.ts`
- Components import data directly rather than prop drilling

#### Key Foundation Components

- **CalloutSection.astro**: Flexible container for highlighted content sections with themeable backgrounds
- **Button.astro**: Polymorphic component (renders as `<a>` or `<button>`) with variant support
- **OptimizedImage.astro**: Image optimization with responsive srcset and lazy loading
- **HtmlHead.astro**: SEO meta tags, OG tags, Twitter cards, and analytics
- **JsonLd.astro**: Generic structured data wrapper

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