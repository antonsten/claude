import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import * as path from 'path';
import * as fs from 'fs';

// Use the same path format as drizzle.config.ts
const dbPath = path.resolve('data/local.db');

console.log('Database connection path:', dbPath);
console.log('Directory exists:', fs.existsSync(path.dirname(dbPath)));

// Create the database connection
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema }); 