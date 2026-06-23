#!/usr/bin/env node

// Keeps the preset/alias dropdowns in the GitHub workflows and .vscode/tasks.json in sync with
// tools/dev-server/registry.json (the single source of truth).
//
//   node tools/dev-server/sync-preset-lists.mjs            # check mode (CI) — exits 1 on drift
//   node tools/dev-server/sync-preset-lists.mjs --write     # rewrite the lists from the registry
//
// Each target file brackets its registry-managed aliases with `presets:start` / `presets:end`
// marker comments; only the lines between the markers are touched.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const START = 'presets:start';
const END = 'presets:end';

const aliases = Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname, 'registry.json'), 'utf8')));

const targets = [
  { file: '.github/workflows/deploy-review.yml', indent: 12, comment: '#', line: (a) => `- ${ a }` },
  { file: '.vscode/tasks.json', indent: 14, comment: '//', line: (a) => `"${ a }",` },
];

function buildBlock(t) {
  const pad = ' '.repeat(t.indent);
  const header = `${ pad }${ t.comment } ${ START } — generated from tools/dev-server/registry.json (run \`pnpm presets:sync\`)`;
  const footer = `${ pad }${ t.comment } ${ END }`;
  const body = aliases.map((a) => `${ pad }${ t.line(a) }`);
  return [ header, ...body, footer ].join('\n');
}

function rewrite(t) {
  const abs = path.join(ROOT, t.file);
  const content = fs.readFileSync(abs, 'utf8');
  const lines = content.split('\n');
  const startIdx = lines.findIndex((l) => l.includes(START));
  const endIdx = lines.findIndex((l) => l.includes(END));
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`Missing or malformed ${ START }/${ END } markers in ${ t.file }`);
  }
  const next = [ ...lines.slice(0, startIdx), ...buildBlock(t).split('\n'), ...lines.slice(endIdx + 1) ].join('\n');
  return { abs, content, next, changed: next !== content };
}

const write = process.argv.includes('--write');
let drift = false;

for (const t of targets) {
  const { abs, next, changed } = rewrite(t);
  if (write) {
    if (changed) {
      fs.writeFileSync(abs, next);
    }
    // eslint-disable-next-line no-console
    console.log(`${ changed ? '✏️  updated ' : '✓ ok      ' } ${ t.file }`);
  } else if (changed) {
    drift = true;
    // eslint-disable-next-line no-console
    console.error(`✗ out of sync: ${ t.file }`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`✓ ${ t.file }`);
  }
}

if (!write && drift) {
  // eslint-disable-next-line no-console
  console.error('\nPreset dropdowns are out of sync with tools/dev-server/registry.json. Run `pnpm presets:sync`.');
  process.exit(1);
}
