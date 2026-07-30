import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const projectRoot = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, projectRoot), 'utf8');
}

test('homepage and Work With Us present Tether as the fifth studio product', async () => {
  for (const page of ['src/pages/index.astro', 'src/pages/work-with-us.astro']) {
    const source = await read(page);

    assert.match(source, /Five products across five domains/);
    assert.match(source, /<h3 class="own-product-name">Tether<\/h3>/);
    assert.match(source, /Experimental · macOS/);
    assert.match(source, /Keeps your Mac awake and remotely reachable/);
    assert.match(source, /Timed sessions/);
    assert.match(source, /Low-battery cutoff/);
    assert.match(source, /Closed-display mode/);
    assert.doesNotMatch(source, /Four products across four domains/);
  }
});

test('AI Labs keeps Tether in the compact showcase without the removed case-study sections', async () => {
  const source = await read('src/pages/ai-labs.astro');

  assert.match(source, /Five products across five domains/);
  assert.match(source, /<h3>5<\/h3>\s*<p>Live experiments<\/p>/);
  assert.match(source, /<h3>Tether<\/h3>/);
  assert.match(source, /Tether is an experimental macOS menu-bar utility/);
  assert.match(source, /href="#products">Tether <span class="footer-status">Experimental<\/span>/);
  assert.doesNotMatch(source, /What We're Learning/);
  assert.doesNotMatch(source, /Five products\. <em>Five open questions\.<\/em>/);
  assert.doesNotMatch(source, /product-card product-card-featured/);
  assert.doesNotMatch(source, /<li><a href="\/ai-labs">AI labs<\/a><\/li>/);
});

test('Tether product artwork exists and is a non-empty WebP image', async () => {
  const imageURL = new URL('public/products/tether-card.webp', projectRoot);
  const imageStat = await stat(imageURL);
  const header = await readFile(imageURL).then((file) => file.subarray(0, 12));

  assert.ok(imageStat.size > 10_000, 'Tether product artwork should not be an empty placeholder');
  assert.equal(header.subarray(0, 4).toString(), 'RIFF');
  assert.equal(header.subarray(8, 12).toString(), 'WEBP');
});

test('Tether page provides a web-ready promo video modal with its poster', async () => {
  const source = await read('src/pages/tether.astro');
  const videoURL = new URL('public/products/tether/tether-glass-wide.mp4', projectRoot);
  const posterURL = new URL('public/products/tether/tether-website-hero.jpg', projectRoot);
  const [videoStat, posterStat, videoHeader, posterHeader] = await Promise.all([
    stat(videoURL),
    stat(posterURL),
    readFile(videoURL).then((file) => file.subarray(0, 12)),
    readFile(posterURL).then((file) => file.subarray(0, 2)),
  ]);

  assert.match(source, /preload="metadata"/);
  assert.match(source, /poster="\/products\/tether\/tether-website-hero\.jpg"/);
  assert.match(source, /src="\/products\/tether\/tether-glass-wide\.mp4" type="video\/mp4"/);
  assert.match(source, /data-tether-promo-open>Watch video<\/button>/);
  assert.match(source, /<dialog class="tether-promo-dialog" data-tether-promo/);
  assert.doesNotMatch(source, /Watch the 35 sec demo ↓/);
  assert.doesNotMatch(source, /See Tether in motion/);
  assert.ok(videoStat.size > 1_000_000, 'Tether product demo should not be an empty placeholder');
  assert.ok(posterStat.size > 100_000, 'Tether video poster should not be an empty placeholder');
  assert.equal(videoHeader.subarray(4, 8).toString(), 'ftyp');
  assert.deepEqual([...posterHeader], [0xff, 0xd8]);
});

test('homepage presents three services with one shared booking action', async () => {
  const source = await read('src/pages/index.astro');

  assert.match(source, /Legacy Code Migration, scoped rollout/);
  assert.match(source, /Dependency and architecture risk map/);
  assert.match(source, /Characterization tests that preserve current behavior/);
  assert.match(source, /data-book-call="services_shared"/);
  assert.doesNotMatch(source, /data-book-call="service_ai_audit"/);
  assert.doesNotMatch(source, /data-book-call="service_ops"/);
});
