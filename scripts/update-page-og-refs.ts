import fs from 'fs';
import path from 'path';

// Map of page files to their OG image slugs
const pageOgMap: Record<string, string> = {
  'work.astro': 'work',
  'articles/index.astro': 'articles',
  'newsletter.astro': 'newsletter',
  'coaching.astro': 'coaching',
  'contact.astro': 'contact',
  'colophon.astro': 'colophon',
  'bestfriends.astro': 'bestfriends',
  'books/products-people-actually-want.astro': 'products-people-actually-want',
};

const pagesDir = path.join(process.cwd(), 'src/pages');

for (const [pageFile, ogSlug] of Object.entries(pageOgMap)) {
  const filePath = path.join(pagesDir, pageFile);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${pageFile}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if already has image prop
  if (content.includes('image=')) {
    console.log(`⏭️  Skipping (already has image): ${pageFile}`);
    continue;
  }

  // Find the Layout component and add image prop
  // Look for <Layout with props ending with >
  const layoutRegex = /(<Layout\s+[^>]*)(>)/;

  if (layoutRegex.test(content)) {
    content = content.replace(layoutRegex, `$1\n  image="/images/og/${ogSlug}.png"$2`);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated: ${pageFile} -> /images/og/${ogSlug}.png`);
  } else {
    console.log(`⚠️  Could not find Layout component: ${pageFile}`);
  }
}

console.log('\n🎉 Done updating page OG image references!');
