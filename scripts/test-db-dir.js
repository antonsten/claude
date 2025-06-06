import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'test.db');

console.log('Current working directory:', process.cwd());
console.log('Database directory:', dbDir);
console.log('Database path:', dbPath);

// Check directory permissions
try {
  const stats = fs.statSync(dbDir);
  console.log('Directory stats:', {
    mode: stats.mode.toString(8),
    uid: stats.uid,
    gid: stats.gid,
    isDirectory: stats.isDirectory(),
    permissions: {
      owner: {
        read: !!(stats.mode & fs.constants.S_IRUSR),
        write: !!(stats.mode & fs.constants.S_IWUSR),
        execute: !!(stats.mode & fs.constants.S_IXUSR),
      },
      group: {
        read: !!(stats.mode & fs.constants.S_IRGRP),
        write: !!(stats.mode & fs.constants.S_IWGRP),
        execute: !!(stats.mode & fs.constants.S_IXGRP),
      },
      others: {
        read: !!(stats.mode & fs.constants.S_IROTH),
        write: !!(stats.mode & fs.constants.S_IWOTH),
        execute: !!(stats.mode & fs.constants.S_IXOTH),
      },
    },
  });
} catch (error) {
  console.error('Error checking directory:', error);
}

// Try to create a test file
try {
  fs.writeFileSync(path.join(dbDir, 'test.txt'), 'test');
  console.log('Successfully created test file');
  fs.unlinkSync(path.join(dbDir, 'test.txt'));
  console.log('Successfully removed test file');
} catch (error) {
  console.error('Error with test file:', error);
}

// Try to create a test database
try {
  const db = new Database(dbPath);
  console.log('Successfully created test database');
  db.close();
  fs.unlinkSync(dbPath);
  console.log('Successfully removed test database');
} catch (error) {
  console.error('Error with test database:', error);
} 