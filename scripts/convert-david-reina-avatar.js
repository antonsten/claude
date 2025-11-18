import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function convertAvatar() {
  const basePath = path.join(__dirname, '..', 'public', 'images', 'author');
  const inputPath = path.join(basePath, 'avatar_david_reina.png');
  const outputPath = path.join(basePath, 'avatar_david_reina.webp');

  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    console.log('✓ Converted avatar_david_reina.png to WebP');
  } catch (err) {
    console.error('✗ Error converting avatar:', err.message);
  }
}

convertAvatar();
