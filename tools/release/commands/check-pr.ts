/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import fs from 'node:fs';
import path from 'node:path';

import { parseArgs } from '../../cli/flags';
import { checkPr } from '../check-pr';
import { repoRoot } from '../git';
import { fetchPullRequest } from '../github';

const USAGE = 'Usage: pnpm release check-pr <number>';
const TEMPLATE_PATH = 'docs/PULL_REQUEST_TEMPLATE.md';

export function parsePrNumber(args: ReadonlyArray<string>): number {
  const { rest } = parseArgs(args, new Map(), {}, { kind: 'reject', usage: USAGE });
  if (rest.length !== 1 || !/^[1-9]\d*$/.test(rest[0])) {
    throw new Error(USAGE);
  }
  return Number(rest[0]);
}

export function checkPrCommand(args: ReadonlyArray<string>): number {
  const number = parsePrNumber(args);
  const template = fs.readFileSync(path.join(repoRoot(), TEMPLATE_PATH), 'utf8');
  const pr = fetchPullRequest(number);
  const failures = checkPr(pr.body, pr.labels, template);

  if (failures.length === 0) {
    console.log(`PR #${ number } passes the PR check.`);
    return 0;
  }

  console.error(`PR #${ number } fails the PR check:`);
  for (const failure of failures) {
    console.error(`  - ${ failure }`);
  }
  console.error(`\nKeep every heading of ${ TEMPLATE_PATH } with its placeholder replaced, and set exactly one category label.`);
  return 1;
}
