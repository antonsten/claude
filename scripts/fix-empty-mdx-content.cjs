const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(__dirname, '../src/content/articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(content);
  // If content is empty or only whitespace, add placeholder
  if (!parsed.content || parsed.content.trim() === '') {
    const newContent = matter.stringify('A short reflection coming soon.', parsed.data);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Added placeholder to ${file}`);
  }
}); 