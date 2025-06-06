import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';
import sharp from 'sharp';

const articlesDir = path.join(process.cwd(), 'src/content/articles');
const outputDir = path.join(process.cwd(), 'public/images/og');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function escapeXML(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.mdx'));

for (const file of files) {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const [, frontmatter] = content.split('---');
  if (!frontmatter) continue;
  let data: any = {};
  try {
    data = load(frontmatter.trim());
  } catch (e) {
    console.error('Failed to parse frontmatter of', file);
    continue;
  }
  const title: string = data.title || 'Untitled';
  const slug: string = data.slug || (
    (data.date ? (new Date(data.date).toISOString().split('T')[0]) : '') + '-' +
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  );
  const url = `https://www.antonsten.com/articles/${slug}/`;

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <style>
    .title { font-family: Helvetica, Arial, sans-serif; font-size: 64px; font-weight: bold; fill: #000; }
    .url { font-family: Helvetica, Arial, sans-serif; font-size: 32px; fill: #000; }
  </style>
  <text x="50%" y="45%" text-anchor="middle" class="title">${escapeXML(title)}</text>
  <text x="50%" y="80%" text-anchor="middle" class="url">${escapeXML(url)}</text>
</svg>`;

  const svgBuffer = Buffer.from(svg);
  const outputPath = path.join(outputDir, `${slug}.png`);
  await sharp(svgBuffer).png().toFile(outputPath);
  console.log('Generated', outputPath);
}
