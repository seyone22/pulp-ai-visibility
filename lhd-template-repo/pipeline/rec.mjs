import puppeteer from 'puppeteer-core';
import path from 'path';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
const url = (await import('url')).pathToFileURL(path.resolve('out/lhd-ai-visibility.html')).href;
await page.goto(url, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const targets = (process.argv[2] || '1,5,7,19,20,28').split(',').map(Number);
const times = [180, 650, 1300, 3400];
for (const t of targets) {
  if (t !== 1) await page.evaluate(n => { location.hash = '#s' + n; }, t);
  else { await page.reload({ waitUntil: 'networkidle0' }); }
  let prev = 0;
  for (const ms of times) { await sleep(ms - prev); prev = ms; await page.screenshot({ path: `shots/r${t}_${ms}.png` }); }
}
await browser.close();
