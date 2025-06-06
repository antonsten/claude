import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function importArticles() {
    try {
        // Path to your articles
        const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles');
        
        // Read all MDX files
        const files = await fs.readdir(articlesDir);
        const mdxFiles = files.filter(file => file.endsWith('.mdx'));
        
        console.log(`Found ${mdxFiles.length} articles to process`);
        
        for (const file of mdxFiles) {
            const filePath = path.join(articlesDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            
            // Parse frontmatter and content
            const { data, content: body } = matter(content);
            
            // Create new file content in CMS format
            const newContent = `---
title: ${JSON.stringify(data.title)}
description: ${JSON.stringify(data.description || '')}
date: ${data.date instanceof Date ? data.date.toISOString() : data.date}
readingTime: ${data.readingTime || 5}
slug: ${JSON.stringify(data.slug || path.basename(file, '.mdx'))}
---

${body}`;
            
            // Write back to the same file
            await fs.writeFile(filePath, newContent, 'utf-8');
            console.log(`Processed: ${file}`);
        }
        
        console.log('Import completed successfully!');
    } catch (error) {
        console.error('Error importing articles:', error);
    }
}

importArticles(); 