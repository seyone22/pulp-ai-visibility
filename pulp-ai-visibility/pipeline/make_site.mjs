import fs from 'fs';
const out = process.argv[2] || '../site';
const body = fs.readFileSync('out/pulp-ai-visibility.html', 'utf8');
const i = body.indexOf('<div class="deck"');
const icon = "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%276%27 fill=%27%23FF4D2D%27/%3E%3Ctext x=%2716%27 y=%2722%27 font-family=%27sans-serif%27 font-weight=%27800%27 font-size=%2713%27 fill=%27white%27 text-anchor=%27middle%27%3EPULP%3C/text%3E%3C/svg%3E";
const html = `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow, noarchive">
<link rel="icon" href="${icon}">
${body.slice(0, i)}</head>
<body>
${body.slice(i)}
</body>
</html>
`;
fs.writeFileSync(out + '/index.html', html);
console.log('Successfully generated site index.html:', html.length, 'bytes');

if (fs.existsSync('technical.html')) {
  fs.copyFileSync('technical.html', out + '/technical.html');
  console.log('Copied technical.html to site directory');
}
fs.copyFileSync('deck.css', out + '/deck.css');
fs.copyFileSync('deck.js', out + '/deck.js');
console.log('Copied deck assets to site directory');
