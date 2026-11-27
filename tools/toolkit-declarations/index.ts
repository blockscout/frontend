/* eslint-disable no-console -- this is a CLI whose entire job is to print the check result */
import path from 'path';

import { runCheck } from './cli';

// This file is only ever run as the compiled ./dist/index.js (see run.sh), which is the directory
// the hops below count from.
const REPO_ROOT = path.resolve(__dirname, '../../..');

const result = runCheck(path.join(REPO_ROOT, 'src/toolkit/package'));

for (const line of result.output) {
  (line.stream === 'err' ? console.error : console.log)(line.text);
}

process.exitCode = result.exitCode;
