import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const SOURCE_ROOT = path.resolve('src');
const SOURCE_EXTENSIONS = new Set(['.astro', '.css', '.js', '.ts']);
const CAPSULE_RADIUS = /border-radius\s*:\s*(?:[5-9]\d|\d{3,})px\b|border-radius\s*:\s*(?:50|100)rem\b/gi;

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) return sourceFiles(entryPath);
      if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) return [entryPath];
      return [];
    }),
  );

  return files.flat();
}

test('served UI does not use pill-shaped border radii', async () => {
  const violations = [];

  for (const file of await sourceFiles(SOURCE_ROOT)) {
    const source = await readFile(file, 'utf8');

    for (const match of source.matchAll(CAPSULE_RADIUS)) {
      const line = source.slice(0, match.index).split('\n').length;
      violations.push(`${path.relative(process.cwd(), file)}:${line} ${match[0]}`);
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Pill-shaped UI is prohibited. Use a 6 to 8px radius or plain text metadata:\n${violations.join('\n')}`,
  );
});
