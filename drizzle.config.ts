import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const dbPath = path.resolve('data/local.db');

console.log('Database path:', dbPath);
console.log('Directory exists:', require('fs').existsSync(path.dirname(dbPath)));

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: `file:${dbPath}`,
  },
} satisfies Config; 