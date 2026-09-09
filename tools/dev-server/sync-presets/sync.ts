// Keeps the preset/alias dropdowns in the GitHub workflows and .vscode/tasks.json in sync with
// tools/dev-server/registry.json (the single source of truth). Each target file brackets its
// registry-managed aliases with `presets:start` / `presets:end` marker comments; only the lines
// between the markers are touched, so the rest of the file and its formatting survive untouched.
//
// Kept free of fs and process access so the specs can exercise block building and splicing without
// a working tree; ./cli.ts is what reads and writes the files.

const START = 'presets:start';
const END = 'presets:end';

export interface PresetTarget {
  readonly file: string;
  readonly indent: number;
  readonly comment: string;
  readonly line: (alias: string) => string;
}

export const TARGETS: ReadonlyArray<PresetTarget> = [
  { file: '.github/workflows/deploy-review.yml', indent: 12, comment: '#', line: (alias) => `- ${ alias }` },
  { file: '.vscode/tasks.json', indent: 14, comment: '//', line: (alias) => `"${ alias }",` },
];

export function parseAliases(registryJson: string): Array<string> {
  return Object.keys(JSON.parse(registryJson) as Record<string, string>);
}

export function buildBlock(target: PresetTarget, aliases: ReadonlyArray<string>): string {
  const pad = ' '.repeat(target.indent);
  const header = `${ pad }${ target.comment } ${ START } — generated from tools/dev-server/registry.json (run \`pnpm presets:sync\`)`;
  const footer = `${ pad }${ target.comment } ${ END }`;
  const body = aliases.map((alias) => `${ pad }${ target.line(alias) }`);
  return [ header, ...body, footer ].join('\n');
}

export function spliceBlock(target: PresetTarget, content: string, aliases: ReadonlyArray<string>): string {
  const lines = content.split('\n');
  const startIndex = lines.findIndex((line) => line.includes(START));
  const endIndex = lines.findIndex((line) => line.includes(END));

  // A missing end marker leaves endIndex at -1, so `<=` rejects that too; equal indexes mean one line
  // carries both markers and brackets no block.
  if (startIndex === -1 || endIndex <= startIndex) {
    throw new Error(`Missing or malformed ${ START }/${ END } markers in ${ target.file }`);
  }

  const block = buildBlock(target, aliases).split('\n');
  return [ ...lines.slice(0, startIndex), ...block, ...lines.slice(endIndex + 1) ].join('\n');
}

export interface SyncResult {
  readonly next: string;
  readonly changed: boolean;
}

export function syncTarget(target: PresetTarget, content: string, aliases: ReadonlyArray<string>): SyncResult {
  const next = spliceBlock(target, content, aliases);
  return { next, changed: next !== content };
}
