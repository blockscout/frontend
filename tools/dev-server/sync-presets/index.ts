/* eslint-disable no-console -- this is a CLI whose entire job is to print a per-target status line */
import path from 'path';

import { runSync } from './cli';

// Regenerates / checks the alias dropdowns from tools/dev-server/registry.json.
//
//   node dist/index.js            # check mode (CI) — exits 1 on drift
//   node dist/index.js --write    # rewrite the lists from the registry
//
// This file is only ever run as the compiled ./dist/index.js (see run.sh), which is the directory
// the hops below count from. It declares no functions of its own: everything worth a test lives in
// ./cli.ts.

const DEV_SERVER_DIR = path.resolve(__dirname, '../..');

const result = runSync({
  root: path.resolve(DEV_SERVER_DIR, '../..'),
  registryPath: path.join(DEV_SERVER_DIR, 'registry.json'),
}, process.argv.includes('--write'));

for (const line of result.output) {
  (line.stream === 'err' ? console.error : console.log)(line.text);
}

process.exitCode = result.exitCode;
