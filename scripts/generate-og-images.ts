import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';
import sharp from 'sharp';

const articlesDir = path.join(process.cwd(), 'src/content/articles');
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

// Check for --force flag to regenerate all images
const forceRegenerate = process.argv.includes('--force');

if (forceRegenerate) {
  console.log('🔄 Force regeneration enabled - will regenerate all images\n');
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
  // Use slug from frontmatter, or fallback to filename without date prefix and extension
  let slug: string = data.slug;
  if (!slug) {
    // Remove date prefix (YYYY-MM-DD-) if present
    slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx$/, '');
  }

  const outputPath = path.join(outputDir, `${slug}.png`);

  // Check if output image exists and is up-to-date (unless force regenerate)
  if (!forceRegenerate && fs.existsSync(outputPath)) {
    const articleStat = fs.statSync(filePath);
    const imageStat = fs.statSync(outputPath);
    if (imageStat.mtime >= articleStat.mtime) {
      // Image is newer or same as article, skip generation
      console.log('⏭️  Skipping (up-to-date):', slug);
      continue;
    }
  }

  // Wrap title text (adjusted for width with 100px padding on each side)
  // With 72px font, approximately 14 chars per line fits in 1000px width (1200 - 200 padding)
  const titleLines = wrapText(title, 30, 3);

  // Debug: Log the wrapped lines
  console.log(`Title: "${title}"`);
  console.log(`Wrapped into ${titleLines.length} lines:`, titleLines);

  // Calculate vertical positions for title lines (bottom-aligned with URL)
  const domainY = 570; // Y position of domain
  const lineHeight = 80; // Space between lines
  const spaceBetweenTitleAndDomain = 60; // Space between last title line and domain

  // Calculate starting Y position based on number of lines
  // Work backwards from domain position
  const lastTitleLineY = domainY - spaceBetweenTitleAndDomain;
  const titleStartY = lastTitleLineY - ((titleLines.length - 1) * lineHeight);

  // Generate text elements for each line
  const titleTextElements = titleLines.map((line, index) => {
    const yPos = titleStartY + (index * lineHeight);
    console.log(`  Line ${index + 1} at Y=${yPos}: "${line}"`);
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
  console.log('✅ Generated:', slug);
}

console.log('\n🎉 Done! All OG images generated.');
