const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(__dirname, '../src/content/articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(content);
  if (parsed.data.image) {
    delete parsed.data.image;
    const newContent = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Removed image field from ${file}`);
  }
}); 