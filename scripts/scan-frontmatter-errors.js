import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import yaml from 'js-yaml';

async function scanFrontmatterErrors() {
  const mdxFiles = await glob('src/content/articles/*.mdx');
  let errorCount = 0;

  for (const file of mdxFiles) {
    let content = await fs.readFile(file, 'utf8');
    const match = content.match(/^---([\s\S]*?)---/);
    if (!match) continue;
    const frontmatterRaw = match[1];
    let frontmatter;
    try {
      frontmatter = yaml.load(frontmatterRaw);
    } catch (e) {
      console.error(`YAML ERROR in ${file}: ${e.message}`);
      errorCount++;
      continue;
    }
    // Check for multiline or missing fields
    ['title', 'slug', 'description'].forEach((key) => {
      if (frontmatter && typeof frontmatter[key] !== 'undefined') {
        if (typeof frontmatter[key] !== 'string') {
          console.warn(`NON-STRING ${key} in ${file}:`, frontmatter[key]);
          errorCount++;
        } else if (/\n/.test(frontmatter[key])) {
          console.warn(`MULTILINE ${key} in ${file}:`, frontmatter[key]);
          errorCount++;
        }
      }
    });
  }
  if (errorCount === 0) {
    console.log('No frontmatter YAML or multiline errors found!');
  } else {
    console.log(`\nTotal files with issues: ${errorCount}`);
  }
}

scanFrontmatterErrors().catch(console.error); 