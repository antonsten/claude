import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { pageConfigs } from './pages-og-config.js';

const outputDir = path.join(process.cwd(), 'public/images/og');
const logoPath = path.join(process.cwd(), 'public/images/logo-icon-og.png');

const semiBoldFontPath = path.join(process.cwd(), 'public/fonts/SuisseIntl-SemiBold-WebM.woff2');
const regularFontPath = path.join(process.cwd(), 'public/fonts/SuisseIntl-Regular-WebM.woff2');

const semiBoldFont = fs.readFileSync(semiBoldFontPath).toString('base64');
const regularFont = fs.readFileSync(regularFontPath).toString('base64');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');

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

// Function to wrap text into lines with max character limit
function wrapText(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        if (lines.length >= maxLines) {
          break;
        }
      }
      currentLine = word;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  // Truncate last line if we exceeded maxLines
  if (lines.length > maxLines) {
    lines.splice(maxLines);
    const lastLine = lines[lines.length - 1];
    if (lastLine.length > maxCharsPerLine - 3) {
      lines[lines.length - 1] = lastLine.substring(0, maxCharsPerLine - 3) + '...';
    }
  }

  return lines;
}

// Check for --force flag
const forceRegenerate = process.argv.includes('--force');

if (forceRegenerate) {
  console.log('🔄 Force regeneration enabled - will regenerate all page images\n');
}

console.log(`Generating OG images for ${pageConfigs.length} pages...\n`);

for (const config of pageConfigs) {
  const { slug, title } = config;
  const outputPath = path.join(outputDir, `${slug}.png`);

  // Skip if exists and not forcing
  if (!forceRegenerate && fs.existsSync(outputPath)) {
    console.log('⏭️  Skipping (already exists):', slug);
    continue;
  }

  // Wrap title text
  const titleLines = wrapText(title, 30, 3);

  console.log(`Generating: ${slug}`);
  console.log(`  Title: "${title}"`);
  console.log(`  Lines: ${titleLines.length}`, titleLines);

  // Calculate vertical positions for title lines (bottom-aligned with URL)
  const domainY = 570;
  const lineHeight = 80;
  const spaceBetweenTitleAndDomain = 60;

  const lastTitleLineY = domainY - spaceBetweenTitleAndDomain;
  const titleStartY = lastTitleLineY - ((titleLines.length - 1) * lineHeight);

  // Generate text elements for each line
  const titleTextElements = titleLines.map((line, index) => {
    const yPos = titleStartY + (index * lineHeight);
    return `<text x="100" y="${yPos}" class="title">${escapeXML(line)}</text>`;
  }).join('\n    ');

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
          font-size: 72px;
          font-weight: 600;
          fill: #ffffff;
        }
        .domain {
          font-family: 'SuisseIntl', Arial, sans-serif;
          font-size: 36px;
          font-weight: 400;
          fill: #ffffff;
        }
      </style>
    </defs>
    <rect width="100%" height="100%" fill="#00A35C"/>
    <image x="100" y="100" width="75" height="75" href="data:image/png;base64,${logoBase64}"/>
    ${titleTextElements}
    <text x="100" y="570" class="domain">www.antonsten.com</text>
  </svg>`;

  const svgBuffer = Buffer.from(svg);
  await sharp(svgBuffer).png().toFile(outputPath);
  console.log('✅ Generated:', slug, '\n');
}

console.log('🎉 Done! All page OG images generated.');
