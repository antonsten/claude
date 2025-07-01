#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';

async function optimizeImages() {
  console.log('🖼️ Starting image optimization...');
  
  // Define directories to optimize
  const imageDirectories = [
    'public/images',
    'public/images/articles',
    'public/images/footer'
  ];

  for (const dir of imageDirectories) {
    if (!fs.existsSync(dir)) {
      console.log(`📁 Skipping ${dir} - directory doesn't exist`);
      continue;
    }

    console.log(`📁 Optimizing images in ${dir}`);

    try {
      // Create WebP versions of large images
      const webpFiles = await imagemin([`${dir}/*.{jpg,jpeg,JPG,JPEG}`], {
        destination: `${dir}/webp`,
        plugins: [
          imageminWebp({
            quality: 80,
            method: 6 // Better compression
          })
        ]
      });

      // Optimize existing JPEGs for fallback
      const optimizedJpegs = await imagemin([`${dir}/*.{jpg,jpeg,JPG,JPEG}`], {
        destination: `${dir}/optimized`,
        plugins: [
          imageminMozjpeg({
            quality: 85,
            progressive: true
          })
        ]
      });

      console.log(`✅ Generated ${webpFiles.length} WebP files in ${dir}`);
      console.log(`✅ Optimized ${optimizedJpegs.length} JPEG files in ${dir}`);

      // Calculate space savings
      for (const file of webpFiles) {
        const originalPath = file.sourcePath;
        const originalSize = fs.statSync(originalPath).size;
        const webpSize = file.data.length;
        const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
        console.log(`💾 ${path.basename(originalPath)}: ${savings}% smaller as WebP`);
      }

    } catch (error) {
      console.error(`❌ Error optimizing ${dir}:`, error.message);
    }
  }

  console.log('🎉 Image optimization complete!');
}

// Run the optimization
optimizeImages().catch(console.error);