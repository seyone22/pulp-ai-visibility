const fs = require('fs');
const html = fs.readFileSync('page.html', 'utf-8');

const slideRegex = /<section[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/section>/gi;
let match;
let slides = [];
while ((match = slideRegex.exec(html)) !== null) {
  const id = match[1];
  const inner = match[2].replace(/<style[\s\S]*?<\/style>/gi, '');
  const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  slides.push({ id, text: text.slice(0, 300) });
}
console.log('Total sections found:', slides.length);
slides.forEach((s, idx) => console.log(`[${idx+1}] #${s.id}: ${s.text.slice(0, 160)}...`));
