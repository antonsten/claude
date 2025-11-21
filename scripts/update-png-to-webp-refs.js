import { glob } from 'glob';
import fs from 'fs';

async function updateReferences() {
  // Find all source files that might have .png references
  const files = await glob('{src,public}/**/*.{astro,ts,tsx,js,jsx,mdx,md,html,json}');

  console.log(`Checking ${files.length} files for .png references`);

  let updatedCount = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    // Replace .png with .webp in image references
    const updated = content.replace(/\.png(?=['"`)\s,\]\}]|$)/g, '.webp');

    if (content !== updated) {
      fs.writeFileSync(file, updated);
      console.log(`✓ Updated: ${file}`);
      updatedCount++;
    }
  }

  console.log(`\nUpdated ${updatedCount} files`);
}

updateReferences();
