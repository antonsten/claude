import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const avatars = [
  'avatar_kevin_twohy.png',
  'avatar_fedor_shkliarau.png',
  'avatar_buzz_usborne.png',
  'avatar_maureen_herben.png',
  'avatar_sharif_matar.png'
];

async function convertAvatars() {
  const basePath = path.join(__dirname, '..', 'public', 'images', 'author');

  for (const avatar of avatars) {
    const inputPath = path.join(basePath, avatar);
    const outputPath = path.join(basePath, avatar.replace('.png', '.webp'));

    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log(`✓ Converted ${avatar} to WebP`);
    } catch (err) {
      console.error(`✗ Error converting ${avatar}:`, err.message);
    }
  }

  console.log('Finished converting book avatars');
}

convertAvatars();
