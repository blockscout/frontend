import { describe, it, expect } from 'vitest';

import type { PresetTarget } from './sync';
import { TARGETS, parseAliases, buildBlock, spliceBlock, syncTarget } from './sync';

const [ WORKFLOW_TARGET, TASKS_TARGET ] = TARGETS;

const ALIASES = [ 'eth', 'gnosis', 'zksync' ];

function workflowFile(aliasLines: ReadonlyArray<string>): string {
  return [
    'on:',
    '  workflow_dispatch:',
    '    inputs:',
    '      preset:',
    '        options:',
    '            # presets:start — generated from tools/dev-server/registry.json (run `pnpm presets:sync`)',
    ...aliasLines,
    '            # presets:end',
    '      variant:',
    '        type: choice',
    '',
  ].join('\n');
}

describe('parseAliases', () => {
  it('reads the registry keys in file order', () => {
    expect(parseAliases('{"zora":"https://a","eth":"https://b","base":"https://c"}'))
      .toEqual([ 'zora', 'eth', 'base' ]);
  });

  it('is empty for an empty registry', () => {
    expect(parseAliases('{}')).toEqual([]);
  });
});

describe('buildBlock', () => {
  it('brackets YAML sequence items with hash-comment markers at the target indent', () => {
    expect(buildBlock(WORKFLOW_TARGET, ALIASES).split('\n')).toEqual([
      '            # presets:start — generated from tools/dev-server/registry.json (run `pnpm presets:sync`)',
      '            - eth',
      '            - gnosis',
      '            - zksync',
      '            # presets:end',
    ]);
  });

  it('brackets quoted JSON array items with slash-comment markers at the target indent', () => {
    expect(buildBlock(TASKS_TARGET, ALIASES).split('\n')).toEqual([
      '              // presets:start — generated from tools/dev-server/registry.json (run `pnpm presets:sync`)',
      '              "eth",',
      '              "gnosis",',
      '              "zksync",',
      '              // presets:end',
    ]);
  });

  it('emits markers with no body for an empty alias list', () => {
    const lines = buildBlock(WORKFLOW_TARGET, []).split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('presets:start');
    expect(lines[1]).toContain('presets:end');
  });
});

describe('spliceBlock', () => {
  it('replaces the bracketed lines and leaves the rest of the file byte-identical', () => {
    const before = workflowFile([ '            - eth', '            - gnosis' ]);
    const after = spliceBlock(WORKFLOW_TARGET, before, ALIASES);

    expect(after).toBe(workflowFile([ '            - eth', '            - gnosis', '            - zksync' ]));
  });

  it('drops aliases the registry no longer lists', () => {
    const before = workflowFile([ '            - eth', '            - dropped_chain' ]);

    expect(spliceBlock(WORKFLOW_TARGET, before, [ 'eth' ])).not.toContain('dropped_chain');
  });

  it('rewrites a hand-edited block back to the registry order', () => {
    const scrambled = workflowFile([ '            - zksync', '            - eth', '            - gnosis' ]);

    expect(spliceBlock(WORKFLOW_TARGET, scrambled, ALIASES))
      .toBe(workflowFile(ALIASES.map((alias) => `            - ${ alias }`)));
  });

  it('throws naming the target file when the start marker is missing', () => {
    const content = [ 'options:', '            - eth', '            # presets:end' ].join('\n');

    expect(() => spliceBlock(WORKFLOW_TARGET, content, ALIASES))
      .toThrow(`Missing or malformed presets:start/presets:end markers in ${ WORKFLOW_TARGET.file }`);
  });

  it('throws naming the target file when the end marker is missing', () => {
    const content = [ 'options:', '            # presets:start', '            - eth' ].join('\n');

    expect(() => spliceBlock(WORKFLOW_TARGET, content, ALIASES))
      .toThrow(`Missing or malformed presets:start/presets:end markers in ${ WORKFLOW_TARGET.file }`);
  });

  it('throws when one line carries both markers, bracketing no block', () => {
    const content = [ 'options:', '            # presets:start — ... # presets:end', '            - eth' ].join('\n');

    expect(() => spliceBlock(WORKFLOW_TARGET, content, ALIASES))
      .toThrow(`Missing or malformed presets:start/presets:end markers in ${ WORKFLOW_TARGET.file }`);
  });

  it('throws when the markers are inverted', () => {
    const content = [
      'options:',
      '            # presets:end',
      '            - eth',
      '            # presets:start',
    ].join('\n');

    expect(() => spliceBlock(TASKS_TARGET, content, ALIASES))
      .toThrow(`Missing or malformed presets:start/presets:end markers in ${ TASKS_TARGET.file }`);
  });
});

describe('syncTarget', () => {
  it('reports no change when the block already matches the registry', () => {
    const content = workflowFile(ALIASES.map((alias) => `            - ${ alias }`));
    const result = syncTarget(WORKFLOW_TARGET, content, ALIASES);

    expect(result.changed).toBe(false);
    expect(result.next).toBe(content);
  });

  it('reports drift and carries the rewritten content when an alias is missing', () => {
    const content = workflowFile([ '            - eth', '            - gnosis' ]);
    const result = syncTarget(WORKFLOW_TARGET, content, ALIASES);

    expect(result.changed).toBe(true);
    expect(result.next).toContain('            - zksync');
  });
});

describe('TARGETS', () => {
  it('covers the workflow dropdown and the VS Code task list', () => {
    expect(TARGETS.map((target: PresetTarget) => target.file))
      .toEqual([ '.github/workflows/deploy-review.yml', '.vscode/tasks.json' ]);
  });
});
