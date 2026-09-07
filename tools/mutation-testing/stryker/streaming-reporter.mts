import type { MutantResult } from '@stryker-mutator/api/core';
import { declareValuePlugin, PluginKind } from '@stryker-mutator/api/plugin';
import type { MutationTestingPlanReadyEvent, Reporter } from '@stryker-mutator/api/report';
import fs from 'fs';
import path from 'path';

import { STREAM_REPORT_FILE } from '../config.js';
import { formatStreamRecord } from './stream.js';

// A Stryker reporter that appends each mutant's verdict to STREAM_REPORT_FILE the moment it is
// tested, so a run stopped at its wall-clock budget still leaves its completed work behind —
// Stryker's own json reporter writes once, at the very end, and a stopped run never gets there.
//
// This file is .mts, and so emitted as ESM, because Stryker loads a plugin through import() and
// reads a `strykerPlugins` binding off the module namespace.

// The name stryker.config.json's `reporters` list enables this plugin under.
const REPORTER_NAME = 'stream';

// Stryker hands reporters absolute paths; its json reporter keys files by a cwd-relative, forward-
// slashed name. Matching that here is what lets a truncated stream be read as if it were the report.
function toReportFileName(fileName: string): string {
  return path.relative(process.cwd(), fileName).replace(/\\/g, '/');
}

class StreamingReporter implements Reporter {
  private directoryReady = false;

  // Appended synchronously, one open-write-close per record. A buffered stream would be the obvious
  // choice, but Stryker answers a signal with process.exit, which drops whatever has not been
  // flushed — and the records that matter most are the last ones before the run was stopped.
  private write(line: string): void {
    if (!this.directoryReady) {
      fs.mkdirSync(path.dirname(STREAM_REPORT_FILE), { recursive: true });
      this.directoryReady = true;
    }
    fs.appendFileSync(STREAM_REPORT_FILE, line);
  }

  public onMutationTestingPlanReady({ mutantPlans }: MutationTestingPlanReadyEvent): void {
    this.write(formatStreamRecord({ kind: 'plan', mutants: mutantPlans.length }));
  }

  public onMutantTested({ fileName, id, mutatorName, status, location }: Readonly<MutantResult>): void {
    this.write(formatStreamRecord({
      kind: 'mutant',
      file: toReportFileName(fileName),
      mutant: { id, mutatorName, status, location },
    }));
  }
}

export const strykerPlugins = [
  declareValuePlugin(PluginKind.Reporter, REPORTER_NAME, new StreamingReporter()),
];
