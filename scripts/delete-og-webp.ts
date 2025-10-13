import fs from 'fs';
import path from 'path';

const ogDir = path.join(process.cwd(), 'public/images/og');

// Find all .webp files
const files = fs.readdirSync(ogDir).filter(f => f.endsWith('.webp'));

console.log(`Found ${files.length} .webp files to delete\n`);

let deletedCount = 0;

for (const file of files) {
  const filePath = path.join(ogDir, file);
  try {
    fs.unlinkSync(filePath);
    deletedCount++;
    console.log(`✅ Deleted: ${file}`);
  } catch (err) {
    console.error(`❌ Error deleting ${file}:`, err);
  }
}

console.log(`\n🎉 Done! Deleted ${deletedCount} .webp files.`);
