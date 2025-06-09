const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const matter = require('gray-matter');

const articlesDir = path.join(__dirname, '../src/content/articles');
const outputDir = path.join(__dirname, '../public/images/og');
const semiBoldFontPath = path.join(__dirname, '../public/fonts/SuisseIntl-SemiBold-WebM.woff2');
const regularFontPath = path.join(__dirname, '../public/fonts/SuisseIntl-Regular-WebM.woff2');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const semiBoldFont = fs.readFileSync(semiBoldFontPath).toString('base64');
const regularFont = fs.readFileSync(regularFontPath).toString('base64');

const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(content);
  let title = data.title || 'Untitled';
  let slug = data.slug || file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx$/, '');
  const url = `https://www.antonsten.com/articles/${slug}/`;

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
          font-size: 40px;
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
  const outputPath = path.join(outputDir, `${slug}.png`);
  sharp(svgBuffer).png().toFile(outputPath).then(() => {
    console.log('Generated', outputPath);
  }).catch(err => {
    console.error('Error generating image for', file, err);
  });
}); 