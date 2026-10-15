// Wraps the artifact HTML into a standalone page for Cloudflare Pages.
import fs from 'fs';
const out = process.argv[2];
const body = fs.readFileSync('out/lhd-ai-visibility.html', 'utf8');
const i = body.indexOf('<div class="deck"');
const icon = "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 fill=%27%232251FF%27/%3E%3Ctext x=%2716%27 y=%2721%27 font-family=%27Arial%27 font-weight=%27700%27 font-size=%2711%27 fill=%27white%27 text-anchor=%27middle%27%3ELHD%3C/text%3E%3C/svg%3E";
const html = `<!doctype html>\n<html lang="en-AU">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="robots" content="noindex, nofollow, noarchive">\n<link rel="icon" href="${icon}">\n${body.slice(0, i)}</head>\n<body>\n${body.slice(i)}\n</body>\n</html>\n`;
fs.writeFileSync(out + '/index.html', html);
console.log('site index', html.length);
