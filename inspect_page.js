const fs = require('fs');
const html = fs.readFileSync('page.html', 'utf-8');

const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
console.log('=== Title ===\n', titleMatch ? titleMatch[1] : 'No title');

// Find headings
const headings = [...html.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => ({
  tag: m[1],
  text: m[2].replace(/<[^>]+>/g, '').trim()
}));
console.log('\n=== Headings ===');
headings.forEach(h => console.log(`${h.tag}: ${h.text}`));

// Find section IDs
const ids = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
console.log('\n=== Distinct IDs ===');
console.log([...new Set(ids)]);
