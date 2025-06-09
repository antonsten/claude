import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';

async function fixMultilineFrontmatter() {
  const mdxFiles = await glob('src/content/articles/*.mdx');
  let totalFixed = 0;

  for (const file of mdxFiles) {
    let content = await fs.readFile(file, 'utf8');
    const match = content.match(/^---([\s\S]*?)---([\s\S]*)$/);
    if (!match) continue;
    let [_, frontmatter, body] = match;

    // Fix multiline for slug, title, description
    frontmatter = frontmatter.replace(/^(slug|title|description): *[>\|]-?\s*([\s\S]*?)(?=^\w+:|$)/gm, (m, key, val) => {
      // Remove newlines and extra spaces
      const singleLine = val.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      return `${key}: ${singleLine}`;
    });

    const newContent = `---\n${frontmatter}---${body}`;
    if (newContent !== content) {
      await fs.writeFile(file, newContent, 'utf8');
      totalFixed++;
      console.log(`Fixed multiline frontmatter in: ${file}`);
    }
  }
  console.log(`\nTotal files fixed: ${totalFixed}`);
}

fixMultilineFrontmatter().catch(console.error); 