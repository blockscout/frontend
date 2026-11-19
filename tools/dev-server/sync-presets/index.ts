/* eslint-disable no-console -- this is a CLI whose entire job is to print a per-target status line */
import path from 'path';

import { runSync } from './cli';

// This file is only ever run as the compiled ./dist/index.js (see run.sh), which is the directory
// the hops below count from.
const DEV_SERVER_DIR = path.resolve(__dirname, '../..');

const result = runSync({
  root: path.resolve(DEV_SERVER_DIR, '../..'),
  registryPath: path.join(DEV_SERVER_DIR, 'registry.json'),
}, process.argv.includes('--write'));

for (const line of result.output) {
  (line.stream === 'err' ? console.error : console.log)(line.text);
}

process.exitCode = result.exitCode;
