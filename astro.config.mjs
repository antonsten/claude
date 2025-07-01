// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.antonsten.com',
  integrations: [
    tailwind({
      // Optimize Tailwind CSS
      applyBaseStyles: false
    }),
    mdx(),
    netlify()
  ],
  build: {
    // Enable asset inlining for small files
    inlineStylesheets: 'auto',
  },
  prefetch: {
    // Prefetch links on hover for faster navigation
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  vite: {
    envDir: './',
    build: {
      // Optimize chunks
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            vendor: ['react', 'react-dom'],
            utils: ['lodash', 'date-fns']
          }
        }
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@astrojs/rss']
    },
    ssr: {
      // Optimize SSR
      noExternal: ['@vercel/og']
    }
  },
  adapter: netlify(),
  compressHTML: true,
});