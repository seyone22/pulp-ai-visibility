// Password gate for private Uprise Digital client pages.
// The password lives in the REPORT_PASSWORD secret (wrangler pages secret put REPORT_PASSWORD).
// A correct password sets a signed cookie; changing the secret signs everyone out.
// The sign-in page is deliberately unbranded so it never looks like a client's own login.

const COOKIE = "uprise_private";
const MAX_AGE = 60 * 60 * 24 * 30;
const PRIVATE = {
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
  "Cache-Control": "private, no-store",
};

async function sign(secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode("uprise-private-v1")));
  return btoa(String.fromCharCode(...sig)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function same(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(request, name) {
  const m = (request.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? m[1] : "";
}

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  if (url.pathname === "/robots.txt") return new Response("User-agent: *\nDisallow: /\n", { headers: { ...PRIVATE, "Content-Type": "text/plain" } });

  const password = env.REPORT_PASSWORD;
  if (!password) return new Response("This page is private.", { status: 503, headers: PRIVATE });
  const expected = await sign(password);

  if (url.pathname === "/logout") {
    return new Response(null, { status: 303, headers: { ...PRIVATE, Location: "/", "Set-Cookie": `${COOKIE}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax` } });
  }

  if (request.method === "POST" && url.pathname === "/login") {
    const form = await request.formData();
    const given = String(form.get("password") || "").trim();
    if (given && same(await sign(given), expected)) {
      return new Response(null, {
        status: 303,
        headers: { ...PRIVATE, Location: "/", "Set-Cookie": `${COOKIE}=${expected}; Max-Age=${MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Lax` },
      });
    }
    return loginPage(true);
  }

  if (same(readCookie(request, COOKIE), expected)) {
    const res = await next();
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(PRIVATE)) out.headers.set(k, v);
    return out;
  }

  return loginPage(false);
}

function loginPage(failed) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="color-scheme" content="light only">
<title>Private page · Uprise Digital</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23111'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap">
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin: 0; background: #FFFFFF; color: #37352F; font-family: "Inter", ui-sans-serif, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; display: flex; align-items: center; -webkit-font-smoothing: antialiased; }
  main { width: 100%; max-width: 420px; margin: 0 auto; padding: 48px 24px; }
  h1 { font-weight: 700; font-size: 28px; line-height: 1.2; letter-spacing: -.02em; margin: 0; }
  p.sub { font-size: 15px; line-height: 1.5; color: #787774; margin: 10px 0 26px; }
  form { display: flex; flex-direction: column; gap: 10px; }
  label { font-size: 12px; font-weight: 500; color: #787774; }
  input { width: 100%; font: inherit; font-size: 15px; color: #37352F; background: rgba(242, 241, 238, .6); border: 1px solid rgba(55, 53, 47, .16); border-radius: 6px; padding: 8px 10px; outline: none; }
  input:focus-visible { border-color: #2383E2; box-shadow: 0 0 0 3px rgba(35, 131, 226, .2); background: #FFFFFF; }
  button { font: inherit; font-size: 14px; font-weight: 500; color: #FFFFFF; background: #37352F; border: 0; border-radius: 6px; height: 36px; cursor: pointer; }
  button:hover { background: #1F1E1B; }
  button:focus-visible { outline: 2px solid rgba(35, 131, 226, .5); outline-offset: 2px; }
  .error { margin: 10px 0 0; color: #D44C47; font-size: 13.5px; }
  .fine { margin-top: 36px; font-size: 12.5px; color: #9B9A97; }
</style>
</head>
<body>
<main>
  <h1>Private page</h1>
  <p class="sub">This page is shared privately by Uprise Digital. Enter the access code you were sent.</p>
  <form method="post" action="/login">
    <label for="password">Access code</label>
    <input id="password" name="password" type="password" autocomplete="off" required autofocus>
    <button type="submit">Continue</button>
  </form>
  ${failed ? '<p class="error" role="alert">That code didn’t match. Try again.</p>' : ""}
  <p class="fine">Uprise Digital · Confidential</p>
</main>
</body>
</html>`;
  return new Response(html, {
    status: failed ? 401 : 200,
    headers: { ...PRIVATE, "Content-Type": "text/html; charset=utf-8" },
  });
}
