const fs = require('fs');
const html = fs.readFileSync('page.html', 'utf-8');
const appendixMatch = html.match(/<section[^>]*id=["']appendix["'][^>]*>([\s\S]*?)<\/section>/i);
if (appendixMatch) {
  console.log(appendixMatch[1].replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, '\n').split('\n').map(s => s.trim()).filter(Boolean).join('\n'));
} else {
  console.log('No appendix found');
}
