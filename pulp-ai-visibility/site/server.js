import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Configurable Credentials
const CLIENT_PIN = (process.env.CLIENT_PIN || '2026').trim();
const INTERNAL_PIN = (process.env.INTERNAL_PIN || '9418').trim();
const SESSION_SECRET = (process.env.SESSION_SECRET || 'pulp-geo-auth-secret-key-2026').trim();

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

function signToken(role) {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(role).digest('hex');
  return `${role}.${hmac}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const [role, hmac] = token.split('.');
  if (!role || !hmac) return null;
  if (role !== 'client' && role !== 'internal') return null;
  const expectedHmac = crypto.createHmac('sha256', SESSION_SECRET).update(role).digest('hex');
  if (crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
    return role;
  }
  return null;
}

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (!rc) return list;
  rc.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const key = parts.shift().trim();
    const val = decodeURI(parts.join('='));
    list[key] = val;
  });
  return list;
}

function renderPinGateHtml(target = '/') {
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
<title>Pulp Digital · Intelligence Portal Gateway</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
  :root {
    --bg: #0C0F14;
    --card: rgba(17, 21, 30, 0.88);
    --border: rgba(255, 255, 255, 0.08);
    --text: #EDF2FA;
    --text-muted: #8A96AA;
    --pulp: #FF4D2D;
    --pulp-hover: #E63D1E;
    --green: #22C55E;
    --red: #EF4444;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: var(--bg);
    color: var(--text);
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background-image: 
      radial-gradient(circle at 50% 15%, rgba(255, 77, 45, 0.12), transparent 50%),
      radial-gradient(circle at 85% 85%, rgba(34, 197, 94, 0.04), transparent 45%);
    background-attachment: fixed;
  }
  .gate-card {
    background: var(--card);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
    padding: 48px 40px;
    max-width: 440px;
    width: 100%;
    text-align: center;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .gate-logo {
    display: inline-block;
    margin-bottom: 24px;
  }
  .gate-logo svg {
    height: 38px;
    width: auto;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: rgba(255, 77, 45, 0.1);
    border: 1px solid rgba(255, 77, 45, 0.25);
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--pulp);
    margin-bottom: 20px;
  }
  .pulse-dot {
    width: 7px;
    height: 7px;
    background: var(--pulp);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--pulp);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.3); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }
  h1 {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 10px;
    color: #FFFFFF;
  }
  p.subtitle {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.5;
    margin-bottom: 30px;
  }
  .input-wrapper {
    position: relative;
    margin-bottom: 20px;
  }
  input[type="password"], input[type="text"] {
    width: 100%;
    background: rgba(12, 15, 20, 0.7);
    border: 1.5px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 16px 48px 16px 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 6px;
    text-align: center;
    color: #FFFFFF;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  input:focus {
    border-color: var(--pulp);
    box-shadow: 0 0 0 3px rgba(255, 77, 45, 0.25);
    background: rgba(12, 15, 20, 0.95);
  }
  .toggle-peek {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .toggle-peek:hover { color: var(--text); }
  .btn-submit {
    width: 100%;
    background: var(--pulp);
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 8px 24px rgba(255, 77, 45, 0.35);
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .btn-submit:hover {
    background: var(--pulp-hover);
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(255, 77, 45, 0.45);
  }
  .btn-submit:active { transform: translateY(0); }
  .error-box {
    margin-top: 16px;
    padding: 12px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--red);
    display: none;
  }
  .shake {
    animation: shakeAnim 0.35s ease-in-out;
  }
  @keyframes shakeAnim {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
  }
  .footer-hints {
    margin-top: 32px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 12px;
    color: var(--text-muted);
    display: flex;
    flex-direction: column;
    gap: 8px;
    line-height: 1.4;
  }
  .hint-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .hint-tag {
    background: rgba(255, 255, 255, 0.06);
    padding: 2px 8px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text);
  }
</style>
</head>
<body>
  <div class="gate-card" id="card">
    <div class="gate-logo">
      <svg aria-label="Pulp Digital" role="img" viewBox="0 0 240 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
          <path d="M12 28C17.5228 28 22 23.5228 22 18C22 11 12 3 12 3C12 3 2 11 2 18C2 23.5228 6.47715 28 12 28Z" fill="#FF4D2D"/>
          <circle cx="12" cy="18" r="4" fill="#FFFFFF" fill-opacity="0.3"/>
          <path d="M38 10H50C54.4 10 57.5 12.8 57.5 17C57.5 21.2 54.4 24 50 24H44.5V32H38V10ZM44.5 19H49.5C51.2 19 52.2 18.2 52.2 17C52.2 15.8 51.2 15 49.5 15H44.5V19Z"/>
          <path d="M63 10H69.5V23C69.5 25.8 71.2 27.2 74 27.2C76.8 27.2 78.5 25.8 78.5 23V10H85V23C85 29.5 80.5 32.5 74 32.5C67.5 32.5 63 29.5 63 23V10Z"/>
          <path d="M92 10H98.5V26.8H108.5V32H92V10Z"/>
          <path d="M114 10H126C130.4 10 133.5 12.8 133.5 17C133.5 21.2 130.4 24 126 24H120.5V32H114V10ZM120.5 19H125.5C127.2 19 128.2 18.2 128.2 17C128.2 15.8 127.2 15 125.5 15H120.5V19Z"/>
          <text x="144" y="27" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-size="15" font-weight="700" letter-spacing="4" fill="currentColor">DIGITAL</text>
        </g>
      </svg>
    </div>
    <div class="badge"><span class="pulse-dot"></span> Authorized Access Only</div>
    <h1>Intelligence Gateway</h1>
    <p class="subtitle">This platform hosts confidential AI visibility analytics and commercial rankings. Please enter your authorization PIN to unlock access.</p>
    
    <form id="pinForm" autocomplete="off">
      <div class="input-wrapper">
        <input type="password" id="pinInput" placeholder="••••" maxlength="12" autofocus required autocomplete="off" />
        <button type="button" class="toggle-peek" id="peekBtn" title="Toggle visibility">
          <svg id="eyeIcon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
      <button type="submit" class="btn-submit" id="submitBtn">
        <span>Unlock Report</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
      <div id="errorBox" class="error-box"></div>
    </form>

    <div class="footer-hints">
      <div class="hint-row"><span>🏢 <b>Client Presentation:</b> Enter client access PIN</span></div>
      <div class="hint-row"><span>🔬 <b>Internal R&amp;D Team:</b> Enter data science clearance PIN</span></div>
    </div>
  </div>

  <script>
    const form = document.getElementById('pinForm');
    const input = document.getElementById('pinInput');
    const peekBtn = document.getElementById('peekBtn');
    const errorBox = document.getElementById('errorBox');
    const submitBtn = document.getElementById('submitBtn');
    const card = document.getElementById('card');
    const targetUrl = ${JSON.stringify(target)};

    peekBtn.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pin = input.value.trim();
      if (!pin) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Verifying...</span>';
      errorBox.style.display = 'none';

      try {
        const res = await fetch('/api/verify-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin, target: targetUrl })
        });
        const data = await res.json();
        if (data.success) {
          submitBtn.style.background = '#22C55E';
          submitBtn.innerHTML = '<span>Clearance Granted ✓</span>';
          setTimeout(() => {
            window.location.href = data.redirect || '/';
          }, 400);
        } else {
          showError(data.error || 'Incorrect PIN code. Access denied.');
        }
      } catch (err) {
        showError('Network error connecting to verification gateway.');
      }
    });

    function showError(msg) {
      errorBox.textContent = msg;
      errorBox.style.display = 'block';
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Unlock Report</span> <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      input.value = '';
      input.focus();
    }
  </script>
</body>
</html>`;
}

function renderForbiddenHtml() {
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
<title>403 Forbidden · Internal Clearance Required</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
  :root {
    --bg: #0C0F14;
    --card: rgba(17, 21, 30, 0.92);
    --border: rgba(255, 255, 255, 0.08);
    --text: #EDF2FA;
    --text-muted: #8A96AA;
    --pulp: #FF4D2D;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background-image: radial-gradient(circle at 50% 20%, rgba(239, 68, 68, 0.12), transparent 50%);
  }
  .card {
    background: var(--card);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 48px 40px;
    max-width: 480px;
    width: 100%;
    text-align: center;
    box-shadow: 0 30px 80px rgba(0,0,0,0.7);
  }
  .lock-icon {
    width: 56px;
    height: 56px;
    background: rgba(255, 77, 45, 0.12);
    border: 1px solid rgba(255, 77, 45, 0.3);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--pulp);
    margin-bottom: 20px;
  }
  h1 { font-size: 22px; font-weight: 800; margin-bottom: 12px; color: #FFF; }
  p { font-size: 14px; color: var(--text-muted); line-height: 1.55; margin-bottom: 24px; }
  .badge {
    display: inline-block;
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #FFF;
    margin-bottom: 16px;
  }
  .btn-group { display: flex; flex-direction: column; gap: 10px; }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-primary { background: var(--pulp); color: #FFF; }
  .btn-primary:hover { background: #E63D1E; }
  .btn-outline { background: transparent; border: 1px solid rgba(255, 255, 255, 0.15); color: var(--text); }
  .btn-outline:hover { background: rgba(255, 255, 255, 0.05); }
</style>
</head>
<body>
  <div class="card">
    <div class="lock-icon">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    </div>
    <div class="badge">ROLE: CLIENT CLEARANCE</div>
    <h1>Internal Clearance Required</h1>
    <p>Your current PIN grants access to the <b>Executive Client Presentation</b>. The Technical Data Science Dossier contains proprietary RAG vector formulas and is restricted exclusively to our internal engineering team.</p>
    <div class="btn-group">
      <a href="/" class="btn btn-primary">← Return to Client Presentation</a>
      <a href="/logout" class="btn btn-outline">Log in with Internal PIN</a>
    </div>
  </div>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  const cookies = parseCookies(req);
  const role = verifyToken(cookies.pulp_auth);

  // 1. Static Assets Allowed Without Authentication
  const isPublicAsset = reqPath === '/deck.css' || reqPath === '/deck.js' || reqPath === '/logo.svg' || reqPath === '/favicon.ico';
  if (isPublicAsset) {
    const assetPath = path.join(__dirname, reqPath);
    if (fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
      const ext = path.extname(assetPath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=86400',
        'X-Robots-Tag': 'noindex, nofollow, noarchive'
      });
      fs.createReadStream(assetPath).pipe(res);
      return;
    }
  }

  // 2. Authentication API Endpoint
  if (req.method === 'POST' && reqPath === '/api/verify-pin') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { pin, target } = JSON.parse(body || '{}');
        const trimmed = (pin || '').trim();

        if (trimmed === INTERNAL_PIN) {
          const token = signToken('internal');
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `pulp_auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
            'X-Robots-Tag': 'noindex, nofollow, noarchive'
          });
          const redirect = target && (target.includes('tech') || target.includes('data-science')) ? '/technical' : '/';
          res.end(JSON.stringify({ success: true, role: 'internal', redirect }));
          return;
        }

        if (trimmed === CLIENT_PIN) {
          const token = signToken('client');
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `pulp_auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
            'X-Robots-Tag': 'noindex, nofollow, noarchive'
          });
          res.end(JSON.stringify({ success: true, role: 'client', redirect: '/' }));
          return;
        }

        // Invalid PIN
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Incorrect PIN code. Access denied.' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Malformed request payload.' }));
      }
    });
    return;
  }

  // 3. Logout Endpoint
  if (reqPath === '/logout') {
    res.writeHead(302, {
      'Set-Cookie': 'pulp_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
      'Location': '/'
    });
    res.end();
    return;
  }

  // 4. Gatekeeper: Unauthenticated users always see PIN Gate
  if (!role) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive'
    });
    res.end(renderPinGateHtml(reqPath));
    return;
  }

  // 5. Technical Dossier Routing
  const isTechRoute = reqPath === '/technical' || reqPath === '/technical.html' || reqPath === '/internal' || reqPath === '/data-science';
  if (isTechRoute) {
    if (role === 'client') {
      // Client is forbidden from seeing technical dossier
      res.writeHead(403, {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow, noarchive'
      });
      res.end(renderForbiddenHtml());
      return;
    }

    if (role === 'internal') {
      const techPath = path.join(__dirname, 'technical.html');
      if (fs.existsSync(techPath)) {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, noarchive'
        });
        fs.createReadStream(techPath).pipe(res);
        return;
      }
    }
  }

  // 6. Client Presentation Route (Both Client and Internal can access)
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');

    // If authenticated as INTERNAL, inject the switcher pill so internal team can jump to the technical dossier!
    if (role === 'internal') {
      const internalBadge = `<a href="/technical" class="nav-toggle-btn" style="position:fixed;top:24px;right:28px;z-index:9999;background:#FF4D2D;color:#FFFFFF;text-decoration:none;padding:10px 18px;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;box-shadow:0 6px 20px rgba(255,77,45,0.4);display:inline-flex;align-items:center;gap:8px;"><span>Internal Dossier →</span></a>`;
      html = html.replace('<div class="deck"', `${internalBadge}\n<div class="deck"`);
    }

    const sessionPill = `<a href="/logout" title="Click to lock session" style="position:fixed;bottom:20px;left:24px;z-index:9999;background:rgba(12,15,20,0.85);border:1px solid rgba(255,255,255,0.12);color:#8A96AA;text-decoration:none;padding:5px 12px;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:12px;display:inline-flex;align-items:center;gap:6px;backdrop-filter:blur(8px);transition:all 0.2s ease;"><span>🔒 ${role === 'internal' ? 'Internal Team' : 'Client Mode'}</span> <span style="opacity:0.6;font-size:11px;">(Lock)</span></a>`;
    html = html.replace('<div class="deck"', `${sessionPill}\n<div class="deck"`);

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive'
    });
    res.end(html);
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Pulp Digital Platform running on http://0.0.0.0:${PORT}`);
  console.log(`Client PIN: ${CLIENT_PIN}`);
  console.log(`Internal PIN: ${INTERNAL_PIN}`);
});
