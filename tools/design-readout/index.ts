/* eslint-disable no-console -- the entry point reports a failed run on stderr */
import { parseArgs } from './cli/args';
import { runCalibrate, runCorrection, runNote, runOverride, runReadout, runRefresh } from './cli/commands';
import { FigmaFetchError } from './fetch/figma';

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv.slice(2));
  switch (parsed.kind) {
    case 'correct':
      runCorrection(parsed.ref, parsed.correction);
      return;
    case 'override':
      runOverride(parsed.ref, parsed.override);
      return;
    case 'note':
      runNote(parsed.ref, parsed.note);
      return;
    case 'calibrate':
      runCalibrate();
      return;
    case 'refresh':
      await runRefresh(parsed.entry);
      return;
    case 'readout':
      await runReadout(parsed.ref, parsed.options);
  }
}

// run.sh always executes the compiled `tools/design-readout/dist/tools/design-readout/index.js`, so that path
// is what marks this module as the process entry point; under vitest the entry is vitest's own binary.
const CLI_ENTRY_PATH = 'design-readout/dist/tools/design-readout/index.js';

function isProcessEntryPoint(): boolean {
  const entry = process.argv[1]?.replace(/\\/g, '/');
  return entry !== undefined && entry.endsWith(CLI_ENTRY_PATH);
}

if (isProcessEntryPoint()) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error instanceof FigmaFetchError ? message : `design:readout failed: ${ message }`);
    process.exitCode = 1;
  });
}
