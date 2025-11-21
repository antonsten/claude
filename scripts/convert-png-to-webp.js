import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs';

async function convertPngToWebp() {
  const pngFiles = await glob('public/**/*.png');

  console.log(`Found ${pngFiles.length} PNG files to convert`);

  for (const pngFile of pngFiles) {
    const webpFile = pngFile.replace(/\.png$/, '.webp');

    try {
      await sharp(pngFile)
        .webp({ quality: 85 })
        .toFile(webpFile);

      console.log(`✓ Converted: ${pngFile} → ${webpFile}`);

      // Delete original PNG
      fs.unlinkSync(pngFile);
      console.log(`  Deleted: ${pngFile}`);
    } catch (error) {
      console.error(`✗ Failed to convert ${pngFile}:`, error.message);
    }
  }

  console.log('\nConversion complete!');
}

convertPngToWebp();
