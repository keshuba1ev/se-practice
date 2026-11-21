/** Local visual QA of the real HTTP-served production build; no connected browser/profile. */
import assert from 'node:assert/strict';
import { stripVTControlCharacters } from 'node:util';
import { createRequire } from 'node:module';
import { spawn, execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const require = createRequire(new URL('../app/package.json', import.meta.url));
const { chromium } = require('playwright');
const appDir = fileURLToPath(new URL('../app/', import.meta.url));
const evidenceDir = fileURLToPath(new URL('./', import.meta.url));
const origin = 'http://127.0.0.1:5182';
const viteCli = fileURLToPath(new URL('../app/node_modules/vite/bin/vite.js', import.meta.url));
const server = spawn(process.execPath, [viteCli, 'preview', '--host', '127.0.0.1', '--port', '5182', '--strictPort'], { cwd: appDir, stdio: ['ignore', 'pipe', 'pipe'] });
let serverText = '';
server.stdout.on('data', b => { serverText += stripVTControlCharacters(b.toString()); });
server.stderr.on('data', b => { serverText += stripVTControlCharacters(b.toString()); });
let browser;
const checks = [];
const pageErrors = [];
const requests = [];
const shots = [];
function ok(message) { checks.push(message); console.log('PASS', message); }
async function shot(page, name, state) {
  const path = `${evidenceDir}${name}.png`;
  await page.screenshot({ path, fullPage: true, animations: 'disabled' });
  const bytes = await readFile(path);
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  shots.push({ name: `${name}.png`, width, height, sha256: createHash('sha256').update(bytes).digest('hex'), state });
  console.log('CAPTURE', name, width, height);
}
function monitor(page) {
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('request', request => requests.push(request.url()));
}
async function available(page) {
  await page.getByRole('status').filter({ hasText: 'Available' }).waitFor();
}
async function unavailable(page) {
  await page.getByRole('alert').filter({ hasText: 'Unavailable' }).waitFor();
}
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Preview did not start: ${serverText}`)), 15000);
    const onData = () => { if (serverText.includes(origin)) { clearTimeout(timeout); resolve(); } };
    server.stdout.on('data', onData);
    server.on('exit', code => { clearTimeout(timeout); reject(new Error(`Preview exited ${code}: ${serverText}`)); });
  });
  const launchOptions = { headless: true };
  if (process.env.CHROMIUM_EXECUTABLE_PATH) launchOptions.executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;
  browser = await chromium.launch(launchOptions);
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await desktop.newPage(); monitor(page);
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.getByLabel('Attendees', { exact: true }).fill('25');
  await page.getByLabel('projector', { exact: true }).check();
  await page.getByLabel('whiteboard', { exact: true }).check();
  const roomButtons = page.locator('section').first().getByRole('button');
  assert.equal(await roomButtons.count(), 2);
  assert.match((await roomButtons.allTextContents()).join(' '), /Athena 101/);
  assert.match((await roomButtons.allTextContents()).join(' '), /Newton 220/);
  ok('F1/F2: 25 attendees + projector + whiteboard leave exactly Athena and Newton.');
  await shot(page, 'filter-match', { attendees: 25, equipment: ['projector', 'whiteboard'], rooms: ['Athena 101', 'Newton 220'] });

  await page.getByLabel('Attendees', { exact: true }).fill('61');
  await page.getByText('No rooms match your requirements', { exact: true }).waitFor();
  assert.equal(await roomButtons.count(), 0);
  ok('F4: 61 attendees produce no rooms and an explicit empty-state message.');
  await shot(page, 'filter-empty', { attendees: 61, equipment: ['projector', 'whiteboard'], rooms: [] });

  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.getByRole('button', { name: /Athena 101/ }).click();
  await page.getByLabel('Start', { exact: true }).fill('10:00');
  await page.getByLabel('End', { exact: true }).fill('11:00');
  await page.getByRole('button', { name: 'Check availability', exact: true }).click();
  await available(page);
  ok('F5 switch-a: Athena is Available at 10:00–11:00, now fixed at 09:00.');
  await shot(page, 'switch-a', { selected: 'Athena 101', start: '10:00', end: '11:00', result: 'Available' });

  await page.getByRole('button', { name: /Curie 204/ }).click();
  await unavailable(page);
  assert.equal(await page.getByLabel('Start', { exact: true }).inputValue(), '10:00');
  assert.equal(await page.getByLabel('End', { exact: true }).inputValue(), '11:00');
  ok('F5 switch-b: same times, Curie becomes Unavailable without another submit.');
  await shot(page, 'switch-b', { selected: 'Curie 204', start: '10:00', end: '11:00', result: 'Unavailable' });

  await page.getByRole('button', { name: /Turing 310/ }).click(); await unavailable(page);
  ok('F3: selectable blocked Turing remains Unavailable.');
  await page.getByRole('button', { name: /Athena 101/ }).click(); await available(page);
  await page.getByLabel('Start', { exact: true }).fill('oops');
  assert.equal(await page.getByLabel('Start', { exact: true }).getAttribute('aria-invalid'), 'true');
  assert.equal(await page.getByText('Available', { exact: true }).count(), 0);
  ok('AC6: malformed time exposes field feedback and removes stale Available status.');
  await page.getByLabel('Start', { exact: true }).fill('10:00');
  await page.getByLabel('End', { exact: true }).fill('12:00'); await available(page);
  ok('B1/B3: exactly 120 minutes ending at the next reservation is Available.');
  await page.getByLabel('End', { exact: true }).fill('12:01'); await unavailable(page);
  ok('B2: 121 minutes is Unavailable.');
  await page.getByLabel('Start', { exact: true }).fill('23:00');
  await page.getByLabel('End', { exact: true }).fill('24:00'); await available(page);
  ok('AC1: 23:00–24:00 is accepted and displayed without midnight wrap.');

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const phone = await mobile.newPage(); monitor(phone);
  await phone.goto(origin, { waitUntil: 'networkidle' });
  await phone.getByLabel('Attendees', { exact: true }).fill('25');
  await phone.getByLabel('projector', { exact: true }).check();
  await phone.getByLabel('whiteboard', { exact: true }).check();
  await phone.getByRole('button', { name: /Athena 101/ }).click();
  await phone.getByLabel('Start', { exact: true }).fill('10:00');
  await phone.getByLabel('End', { exact: true }).fill('11:00');
  await phone.getByRole('button', { name: 'Check availability', exact: true }).click(); await available(phone);
  const layout = await phone.evaluate(() => ({ width: window.innerWidth, client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, height: window.innerHeight }));
  assert.equal(layout.width, 390); assert.ok(layout.scroll <= layout.client, JSON.stringify(layout));
  ok(`AC6: actual 390×844 browser viewport, no horizontal overflow (${layout.scroll}/${layout.client}), form and Available result visible after scrolling.`);
  await shot(phone, 'narrow', { viewport: { width: 390, height: 844 }, layout, selected: 'Athena 101', start: '10:00', end: '11:00', result: 'Available', emulation: 'Chromium mobile viewport; not physical hardware' });

  assert.deepEqual(pageErrors, []); assert.ok(requests.every(url => url.startsWith(origin)));
  ok('No page errors and no requests outside the local preview server.');
  assert.equal(new Set(shots.map(s => s.sha256)).size, 5);
  const manifest = { sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: appDir, encoding: 'utf8' }).trim(), capturedAt: new Date().toISOString(), browser: await browser.version(), origin, checks, pageErrors, requestCount: requests.length, screenshots: shots };
  await writeFile(`${evidenceDir}capture-manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`SUMMARY: ${checks.length} checks passed; 5 distinct screenshots saved.`);
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
