/** Local visual QA of the real HTTP-served production build; no connected browser/profile. */
import assert from 'node:assert/strict';
import { stripVTControlCharacters } from 'node:util';
import { createRequire } from 'node:module';
import { spawn, execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE || new URL('../app/package.json', import.meta.url));
const { chromium } = process.env.PLAYWRIGHT_PACKAGE ? require(process.env.PLAYWRIGHT_PACKAGE) : require('playwright');
const appDir = fileURLToPath(new URL('../app/', import.meta.url));
const evidenceDir = fileURLToPath(new URL('./', import.meta.url));
const origin = 'http://127.0.0.1:5183';
const viteCli = fileURLToPath(new URL('../app/node_modules/vite/bin/vite.js', import.meta.url));
const server = spawn(process.execPath, [viteCli, 'preview', '--host', '127.0.0.1', '--port', '5183', '--strictPort'], { cwd: appDir, stdio: ['ignore', 'pipe', 'pipe'] });
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
    server.stdout.on('data', () => { if (serverText.includes(origin)) { clearTimeout(timeout); resolve(); } });
    server.on('exit', code => { clearTimeout(timeout); reject(new Error(`Preview exited ${code}: ${serverText}`)); });
  });
  browser = await chromium.launch({ headless: true });
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await desktop.newPage(); monitor(page);
  await page.goto(origin, { waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('button', { name: /Athena 101/ }).count(), 1);
  await page.getByRole('button', { name: /Athena 101/ }).click();
  await page.getByLabel('Start', { exact: false }).fill('10:00');
  await page.getByLabel('End', { exact: false }).fill('11:00');
  await page.getByLabel('Current time', { exact: true }).fill('09:00');
  await page.getByRole('button', { name: 'Check availability', exact: true }).click();
  await page.getByText('Available', { exact: true }).waitFor();
  ok('AC4/AC6 desktop: touching reservation endpoint is Available; only one fictional room is shown.');
  await shot(page, 'ui-desktop', { start:'10:00', end:'11:00', currentTime:'09:00', result:'Available' });
  await page.getByLabel('End', { exact: false }).fill('10:00');
  assert.equal(await page.getByText('Available', { exact: true }).count(), 1);
  ok('R4 reproduced (unmitigated): stale Available remains after editing end to equal start, until resubmit.');
  await page.getByRole('button', { name: 'Check availability', exact: true }).click();
  await page.getByText('Unavailable', { exact: true }).waitFor();
  ok('AC1: resubmit rejects reversed/zero interval with explicit feedback.');
  const mobile = await browser.newContext({ viewport: { width:390, height:844 }, deviceScaleFactor:1, isMobile:true, hasTouch:true });
  const phone = await mobile.newPage(); monitor(phone);
  await phone.goto(origin, { waitUntil:'networkidle' });
  await phone.getByRole('button', { name:/Athena 101/ }).click();
  await phone.getByLabel('Start', { exact:false }).fill('09:30');
  await phone.getByLabel('End', { exact:false }).fill('10:30');
  await phone.getByLabel('Current time', { exact:true }).fill('09:00');
  await phone.getByRole('button', { name:'Check availability', exact:true }).click();
  await phone.getByText('Unavailable', { exact:true }).waitFor();
  await phone.getByText('Overlaps an existing booking', { exact:false }).waitFor();
  const layout=await phone.evaluate(()=>({ width:innerWidth, client:document.documentElement.clientWidth, scroll:document.documentElement.scrollWidth }));
  assert.ok(layout.scroll<=layout.client);
  ok('AC4/AC6 mobile: overlap rejected with precise reason, 390px viewport has no horizontal overflow.');
  await shot(phone, 'ui-mobile', { start:'09:30',end:'10:30',currentTime:'09:00',result:'Unavailable',viewport:{width:390,height:844},layout });
  assert.deepEqual(pageErrors, []);
  assert.ok(requests.every(url=>url.startsWith(origin)));
  ok('No page errors or external application requests.');
  const manifest={sourceCommit:process.env.GITHUB_SHA || execFileSync('git',['rev-parse','HEAD'],{cwd:appDir,encoding:'utf8'}).trim(),capturedAt:new Date().toISOString(),browser:browser.version(),origin,checks,pageErrors,screenshots:shots};
  await writeFile(`${evidenceDir}capture-manifest.json`, JSON.stringify(manifest,null,2)+'\n');
  console.log(`SUMMARY: ${checks.length} browser checks; ${shots.length} actual screenshots. Automated interaction, not a claim of student manual UI testing.`);
} finally {
  if(browser)await browser.close();
  server.kill('SIGTERM');
}
