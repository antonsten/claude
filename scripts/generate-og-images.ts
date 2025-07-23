import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';
import sharp from 'sharp';

const articlesDir = path.join(process.cwd(), 'src/content/articles');
const outputDir = path.join(process.cwd(), 'public/images/og');

const semiBoldFontPath = path.join(process.cwd(), 'public/fonts/SuisseIntl-SemiBold-WebM.woff2');
const regularFontPath = path.join(process.cwd(), 'public/fonts/SuisseIntl-Regular-WebM.woff2');

const semiBoldFont = fs.readFileSync(semiBoldFontPath).toString('base64');
const regularFont = fs.readFileSync(regularFontPath).toString('base64');

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
  const outputPath = path.join(outputDir, `${file.replace(/\.mdx$/, '')}.png`);

  // Check if output image exists and is up-to-date
  if (fs.existsSync(outputPath)) {
    const articleStat = fs.statSync(filePath);
    const imageStat = fs.statSync(outputPath);
    if (imageStat.mtime >= articleStat.mtime) {
      // Image is newer or same as article, skip generation
      console.log('Skipping (up-to-date):', outputPath);
      continue;
    }
  }

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
  const slug = data.slug;
  const slugFromFile = file.replace(/\.mdx$/, '');

  const url = `https://www.antonsten.com/articles/${slugFromFile}/`;

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style type="text/css">
        @font-face {
          font-family: 'SuisseIntl';
          src: url('data:font/woff2;base64,${semiBoldFont}') format('woff2');
          font-weight: 600;
          font-style: normal;
        }
        @font-face {
          font-family: 'SuisseIntl';
          src: url('data:font/woff2;base64,${regularFont}') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
        .title {
          font-family: 'SuisseIntl', Arial, sans-serif;
          font-size: 48px;
          font-weight: 600;
          fill: #111;
        }
        .url {
          font-family: 'SuisseIntl', Arial, sans-serif;
          font-size: 32px;
          font-weight: 400;
          fill: #888;
        }
      </style>
    </defs>
    <rect width="100%" height="100%" fill="#fff"/>
    <text x="60" y="540" class="title">${escapeXML(title)}</text>
    <text x="60" y="590" class="url">${escapeXML(url)}</text>
  </svg>`;

  const svgBuffer = Buffer.from(svg);
  await sharp(svgBuffer).png().toFile(outputPath);
  console.log('Generated', outputPath);
}
