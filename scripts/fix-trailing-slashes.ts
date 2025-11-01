import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';

/**
 * Fix trailing slashes in internal links across MDX files and Astro components
 * Ensures all internal links end with a trailing slash
 */

const CONTENT_PATTERNS = [
  'src/content/**/*.mdx',
  'src/pages/**/*.astro',
  'src/components/**/*.astro',
  'src/layouts/**/*.astro'
];

// Internal paths that should have trailing slashes
const INTERNAL_PATHS = [
  '/about',
  '/work',
  '/articles',
  '/coaching',
  '/contact',
  '/colophon',
  '/newsletter',
  '/testimonials',
  '/books/products-people-actually-want',
  '/books/masteringfreelance'
];

// Regex patterns to match internal links without trailing slashes
const LINK_PATTERNS = [
  // Markdown links: [text](/path)
  /\[([^\]]+)\]\((\/([\w\-/]+))\)/g,
  // HTML anchor tags: href="/path"
  /href="(\/([\w\-/]+))"/g,
  // Astro components with path prop: path="/path"
  /path="(\/([\w\-/]+))"/g
];

function fixTrailingSlashes(content: string): { content: string; changes: number } {
  let updatedContent = content;
  let changes = 0;

  // Fix markdown links
  updatedContent = updatedContent.replace(
    /\[([^\]]+)\]\((\/(?:articles|about|work|coaching|contact|colophon|newsletter|testimonials|books|case)[^\s)]*)\)/g,
    (match, text, url) => {
      // Skip if already has trailing slash, is a file, or has query params/hash
      if (url.endsWith('/') || url.includes('.') || url.includes('?') || url.includes('#')) {
        return match;
      }
      changes++;
      return `[${text}](${url}/)`;
    }
  );

  // Fix HTML href attributes
  updatedContent = updatedContent.replace(
    /href="(\/(?:articles|about|work|coaching|contact|colophon|newsletter|testimonials|books|case)[^\s"]*)"/g,
    (match, url) => {
      // Skip if already has trailing slash, is a file, or has query params/hash
      if (url.endsWith('/') || url.includes('.') || url.includes('?') || url.includes('#')) {
        return match;
      }
      changes++;
      return `href="${url}/"`;
    }
  );

  // Fix Astro path props
  updatedContent = updatedContent.replace(
    /path="(\/(?:articles|about|work|coaching|contact|colophon|newsletter|testimonials|books|case)[^\s"]*)"/g,
    (match, url) => {
      // Skip if already has trailing slash, is a file, or has query params/hash
      if (url.endsWith('/') || url.includes('.') || url.includes('?') || url.includes('#')) {
        return match;
      }
      changes++;
      return `path="${url}/"`;
    }
  );

  return { content: updatedContent, changes };
}

async function main() {
  console.log('🔍 Finding files to process...\n');

  let totalFiles = 0;
  let totalChanges = 0;
  let filesChanged = 0;

  for (const pattern of CONTENT_PATTERNS) {
    const files = await glob(pattern);

    for (const file of files) {
      totalFiles++;
      const filePath = join(process.cwd(), file);
      const originalContent = readFileSync(filePath, 'utf-8');

      const { content: updatedContent, changes } = fixTrailingSlashes(originalContent);

      if (changes > 0) {
        writeFileSync(filePath, updatedContent, 'utf-8');
        filesChanged++;
        totalChanges += changes;
        console.log(`✅ ${file}: ${changes} link${changes > 1 ? 's' : ''} updated`);
      }
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${totalFiles}`);
  console.log(`   Files changed: ${filesChanged}`);
  console.log(`   Total links fixed: ${totalChanges}`);

  if (totalChanges > 0) {
    console.log(`\n✨ All internal links now have trailing slashes!`);
  } else {
    console.log(`\n✅ All links already have proper trailing slashes!`);
  }
}

main().catch(console.error);
