import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  if (reqPath === '/technical' || reqPath === '/internal' || reqPath === '/data-science') reqPath = '/technical.html';
  const filePath = path.join(__dirname, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'X-Robots-Tag': 'noindex, nofollow, noarchive'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(__dirname, 'index.html');
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive'
    });
    fs.createReadStream(indexPath).pipe(res);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Pulp Digital presentation running on http://0.0.0.0:${PORT}`);
});
