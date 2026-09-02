import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

import { JSON_REPORT_FILE, SANDBOX_DIR, STOP_GRACE_MS, STREAM_REPORT_FILE, STRYKER_BIN, STRYKER_CONFIG_FILE } from '../config';
import type { MutateTarget } from '../select/files';

// Runs Stryker over a selection, under a wall-clock budget. Everything that does not vary per run
// lives in the committed stryker.config.json, so the command line carries only what to mutate.

// Stryker rejects a mutation range on a pattern minimatch reads as a glob, and Next.js route files
// (`src/pages/tx/[hash].tsx`) are exactly that. Escaping the metacharacters makes the pattern
// literal — which is also the only form that matches such a path at all.
const GLOB_METACHARACTERS = /([[\]{}()*?!+@])/g;

// A run stopped at its budget has no complete json report, only the stream the reporter plugin
// appended to. `truncated` is what tells the report which of the two to read, and says so in print.
export interface RunOutcome {
  readonly truncated: boolean;
}

// One `mutate` entry per range: Stryker unions the ranges it is given for the same file, and a file
// named with no range at all would be mutated in full.
export function formatMutateTargets(targets: ReadonlyArray<MutateTarget>): Array<string> {
  return targets.flatMap(({ file, ranges }) => {
    const pattern = file.replace(GLOB_METACHARACTERS, '\\$1');
    return ranges.map(([ start, end ]) => `${ pattern }:${ start }-${ end }`);
  });
}

// A run that dies leaves the previous run's output behind, and reading that would present stale
// results as fresh ones. Clearing it first makes a failed run visibly result-less instead. The
// sandbox goes too: Stryker removes it only on an exit it controls, so a stopped run leaves a full
// copy of the repo on disk.
function clearPreviousRun(): void {
  fs.mkdirSync(path.dirname(JSON_REPORT_FILE), { recursive: true });
  fs.rmSync(JSON_REPORT_FILE, { force: true });
  fs.rmSync(STREAM_REPORT_FILE, { force: true });
  fs.rmSync(SANDBOX_DIR, { recursive: true, force: true });
}

type StopSignal = 'SIGTERM' | 'SIGKILL';

// Stryker forks a worker per concurrent test run and, on a signal, exits without killing them — so
// signalling the process alone orphans the vitest workers. The run is spawned detached, which makes
// it a process-group leader, and a negative pid signals the whole group.
function signalGroup(pid: number, signal: StopSignal): void {
  try {
    process.kill(-pid, signal);
  } catch { /* ESRCH: nothing left in the group, which is the outcome being asked for. */ }
}

const FORWARDED_SIGNALS = [ 'SIGINT', 'SIGTERM' ] as const;

export function runStryker(targets: ReadonlyArray<MutateTarget>, budgetMs: number): Promise<RunOutcome> {
  clearPreviousRun();

  // The config file is a positional argument to `stryker run`, not a flag. --mutate takes one
  // comma-separated list; repeating the flag overwrites it rather than appending.
  const args = [ 'run', STRYKER_CONFIG_FILE, '--mutate', formatMutateTargets(targets).join(',') ];
  const child = spawn(STRYKER_BIN, args, { stdio: 'inherit', detached: true });

  return new Promise<RunOutcome>((resolve, reject) => {
    const pid = child.pid;
    let budgetExpired = false;
    let interrupted = false;
    let hardStop: ReturnType<typeof setTimeout> | undefined;

    function stop(): void {
      if (pid === undefined) return;
      signalGroup(pid, 'SIGTERM');
      hardStop = setTimeout(() => signalGroup(pid, 'SIGKILL'), STOP_GRACE_MS);
    }

    const budget = setTimeout(() => {
      budgetExpired = true;
      stop();
    }, budgetMs);

    // Detaching puts the run outside the terminal's foreground group, so a Ctrl-C reaches this
    // process only. Without forwarding it, quitting the CLI would leave the whole run behind.
    function interrupt(): void {
      interrupted = true;
      stop();
    }
    for (const signal of FORWARDED_SIGNALS) process.on(signal, interrupt);

    function cleanUp(): void {
      clearTimeout(budget);
      if (hardStop !== undefined) clearTimeout(hardStop);
      for (const signal of FORWARDED_SIGNALS) process.off(signal, interrupt);
      // The group's leader has exited; anything still in the group is a worker that outlived it.
      // This process is not in that group, so the sweep cannot reach it.
      if (pid !== undefined) signalGroup(pid, 'SIGKILL');
      // Stryker removes the sandbox itself, but only on an exit it controls.
      fs.rmSync(SANDBOX_DIR, { recursive: true, force: true });
    }

    child.on('error', (error) => {
      cleanUp();
      reject(error);
    });

    child.on('exit', (code) => {
      cleanUp();
      if (interrupted) {
        reject(new Error('Run interrupted.'));
        return;
      }
      // Stryker keeps working for a moment after writing its reports — disposing workers, clearing
      // the sandbox — so a budget expiring in that window did not cost any results. The json report
      // is the honest test: Stryker writes it only once a whole run has finished.
      if (budgetExpired) {
        resolve({ truncated: !fs.existsSync(JSON_REPORT_FILE) });
        return;
      }
      if (code === 0) {
        resolve({ truncated: false });
        return;
      }
      reject(new Error('Stryker did not finish — see its output above for why.'));
    });
  });
}
