import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const ARTICLES_DIR = 'src/content/articles';

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\*_~#>\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function createDescription(text, maxWords = 30, maxLength = 160) {
  const clean = stripMarkdown(text);
  const words = clean.split(/\s+/);
  let selected = words.slice(0, maxWords);
  let desc = selected.join(' ');
  if (desc.length > maxLength) {
    desc = desc.slice(0, maxLength).replace(/\s+\S*$/, '');
  }
  if (words.length > maxWords || clean.length > desc.length) {
    if (desc.length <= maxLength - 3) desc += '...';
  }
  return desc;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;
  const yaml = match[1];
  const body = match[2];
  const data = {};
  for (const line of yaml.split(/\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) {
      data[m[1]] = m[2].replace(/^"|"$/g, '');
    }
  }
  return { data, body };
}

function stringifyFrontmatter(data, body) {
  const yaml = Object.entries(data)
    .map(([k, v]) => `${k}: ${typeof v === 'string' && /[\"\':]/.test(v) ? `"${v}"` : v}`)
    .join('\n');
  return `---\n${yaml}\n---\n\n${body}`;
}

async function updateDescriptions() {
  const files = await readdir(ARTICLES_DIR);
  for (const file of files) {
    if (!file.endsWith('.mdx') && !file.endsWith('-mdx')) continue;
    const filePath = join(ARTICLES_DIR, file);
    const raw = await readFile(filePath, 'utf8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) continue;
    const { data, body } = parsed;
    let desc = body.trim() ? createDescription(body) : data.title || '';
    data.description = desc;
    const newContent = stringifyFrontmatter(data, body);
    await writeFile(filePath, newContent);
    console.log(`Updated description for ${file}`);
  }
}

updateDescriptions();
