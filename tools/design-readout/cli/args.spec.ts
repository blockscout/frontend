import { describe, expect, it } from 'vitest';

import type { CliOptions, CorrectionRequest, OverrideRequest } from './args';
import { parseArgs } from './args';

const URL = 'https://www.figma.com/design/abcDEF0123456789abcDEF/Pages?node-id=22842-174340';

function readout(argv: ReadonlyArray<string>): CliOptions {
  const parsed = parseArgs(argv);
  if (parsed.kind !== 'readout') throw new Error(`Expected a readout, got ${ parsed.kind }`);
  return parsed.options;
}

function correction(argv: ReadonlyArray<string>): CorrectionRequest {
  const parsed = parseArgs(argv);
  if (parsed.kind !== 'correct') throw new Error(`Expected a correction, got ${ parsed.kind }`);
  return parsed.correction;
}

function override(argv: ReadonlyArray<string>): OverrideRequest {
  const parsed = parseArgs(argv);
  if (parsed.kind !== 'override') throw new Error(`Expected an override, got ${ parsed.kind }`);
  return parsed.override;
}

describe('parseArgs', () => {
  it('takes the node URL as the one positional and --dump in both forms', () => {
    expect(parseArgs([ URL ])).toEqual({
      kind: 'readout',
      options: {
        dump: undefined, regions: undefined, correct: undefined, gap: undefined, stage: undefined, override: undefined, note: undefined,
        calibrate: false, refresh: false,
      },
      ref: { fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' },
    });
    expect(readout([ URL, '--dump', 'out.json' ]).dump).toBe('out.json');
    expect(readout([ '--dump=out.json', URL ]).dump).toBe('out.json');
  });

  it('takes --regions as comma-separated node ids in either form, nested ones included, canonicalized', () => {
    expect(readout([ URL, '--regions', '1-2, 3:4,I5-6;7-8' ]).regions).toEqual([ '1:2', '3:4', 'I5:6;7:8' ]);
    expect(() => parseArgs([ URL, '--regions', '1-2,abc' ])).toThrow(/Not a node id in --regions: abc\nUsage:/);
  });

  it('takes --calibrate and --refresh [<entry>] without a URL, and rejects a URL or a per-node flag with them', () => {
    expect(parseArgs([ '--calibrate' ])).toEqual({ kind: 'calibrate' });
    expect(parseArgs([ '--refresh' ])).toEqual({ kind: 'refresh', entry: undefined });
    expect(parseArgs([ '--refresh', 'blocks-table-item' ])).toEqual({ kind: 'refresh', entry: 'blocks-table-item' });
    expect(() => parseArgs([ '--calibrate', URL ])).toThrow(/--calibrate takes no argument: https/);
    expect(() => parseArgs([ '--refresh', 'a', 'b' ])).toThrow(/--refresh takes at most one entry name: a b/);
    expect(() => parseArgs([ '--calibrate', '--refresh' ])).toThrow(/--calibrate and --refresh are separate runs/);
    expect(() => parseArgs([ '--calibrate', '--dump', 'x' ])).toThrow(/--calibrate works on the calibration set and takes no per-node flag/);
    expect(() => parseArgs([ '--refresh', '--gap', 'shape' ])).toThrow(/--refresh works on the calibration set and takes no per-node flag/);
    expect(() => parseArgs([ '--calibrate', '--override', '1-2' ])).toThrow(/--calibrate works on the calibration set and takes no per-node flag/);
    expect(() => parseArgs([ '--calibrate', '--note', 'x', '--gap', 'markup' ])).toThrow(/--calibrate works on the calibration set and takes no per-node flag/);
  });

  it('takes --note with its text and the --gap category, in either flag form', () => {
    expect(parseArgs([ URL, '--note', 'the row gap is 8px, the mockup has 12px', '--gap', 'markup' ])).toEqual({
      kind: 'note',
      ref: { fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' },
      note: { text: 'the row gap is 8px, the mockup has 12px', gap: 'markup' },
    });
    expect(parseArgs([ '--gap=layout', '--note=  cells wrap  ', URL ])).toEqual({
      kind: 'note',
      ref: { fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' },
      note: { text: 'cells wrap', gap: 'layout' },
    });
  });

  it('rejects --note without --gap, with blank text, with a stray word, and beside --correct or --override', () => {
    expect(() => parseArgs([ URL, '--note', 'cells wrap' ]))
      .toThrow(/A note is always a miss: --note needs --gap <shape\|icon\|color\|composite\|context\|layout\|convention\|markup>\nUsage:/);
    expect(() => parseArgs([ URL, '--note', '  ', '--gap', 'markup' ])).toThrow(/--note needs the text of the miss, in quotes\nUsage:/);
    expect(() => parseArgs([ URL, '--note', 'cells wrap', '--gap', 'markup', 'Box' ])).toThrow(/Unexpected argument: Box/);
    expect(() => parseArgs([ URL, '--note', 'cells wrap', '--gap', 'markup', '--correct', '1-2', 'Box' ]))
      .toThrow(/--note is its own run: a note names no node, so it goes with neither --correct nor --override\nUsage:/);
    expect(() => parseArgs([ URL, '--note', 'cells wrap', '--gap', 'markup', '--override', '1-2', 'bg=x' ])).toThrow(/--note is its own run/);
  });

  it('takes --override with the node id and one or more prop=value words', () => {
    expect(parseArgs([ URL, '--override', '22842-178386', 'bg=whiteAlpha.100', 'fontWeight=500' ])).toEqual({
      kind: 'override',
      ref: { fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' },
      override: { nodeId: '22842:178386', props: [ 'bg=whiteAlpha.100', 'fontWeight=500' ] },
    });
    expect(override([ '--override=I1:2;3:4', URL, 'color=text.primary' ])).toEqual({ nodeId: 'I1:2;3:4', props: [ 'color=text.primary' ] });
  });

  it('rejects --override with --correct or --gap, with no word, with a word that is not prop=value, and with a bad node id', () => {
    expect(() => parseArgs([ URL, '--override', '1-2', 'bg=x', '--correct', '1-2', 'Box', '--gap', 'color' ]))
      .toThrow(/--override and --correct are separate runs: an override is never a miss and takes no --gap\nUsage:/);
    expect(() => parseArgs([ URL, '--override', '1-2', 'bg=x', '--gap', 'color' ])).toThrow(/--override and --correct are separate runs/);
    expect(() => parseArgs([ URL, '--override', '1-2', 'bg=x', '--correct', '1-2', 'Box' ])).toThrow(/--override and --correct are separate runs/);
    expect(() => parseArgs([ URL, '--override', '1-2' ])).toThrow(/--override 1:2 needs at least one <prop>=<value> word, after the URL\nUsage:/);
    expect(() => parseArgs([ URL, '--override', '1-2', 'noIcon' ])).toThrow(/An override is one <prop>=<value> per word, no spaces inside: noIcon\nUsage:/);
    expect(() => parseArgs([ URL, '--override', '1-2', 'bg=' ])).toThrow(/An override is one <prop>=<value> per word, no spaces inside: bg=/);
    expect(() => parseArgs([ URL, '--override', 'abc', 'bg=x' ])).toThrow(/Not a node id in --override: abc\nUsage:/);
  });

  it('rejects a missing, extra or malformed URL with the usage line', () => {
    expect(() => parseArgs([])).toThrow(/Missing the Figma node URL\nUsage:/);
    expect(() => parseArgs([ URL, URL ])).toThrow(/Unexpected argument/);
    expect(() => parseArgs([ '22842:174340' ])).toThrow(/Not a Figma node URL: 22842:174340\nUsage:/);
    expect(() => parseArgs([ URL, '--json' ])).toThrow(/Unknown flag: --json/);
  });

  it('takes --correct with the node id, the component and its props as words, and the --gap category', () => {
    expect(parseArgs([ URL, '--correct', '22842-178386', 'BlockEntity', 'noIcon', 'size=sm', '--gap', 'context' ])).toEqual({
      kind: 'correct',
      ref: { fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' },
      correction: { nodeId: '22842:178386', component: 'BlockEntity', props: [ 'noIcon', 'size=sm' ], gap: 'context', stage: 'readout' },
    });
    expect(correction([ '--gap=icon', URL, '--correct=I1:2;3:4', 'IconSvg' ]))
      .toEqual({ nodeId: 'I1:2;3:4', component: 'IconSvg', props: [], gap: 'icon', stage: 'readout' });
  });

  it('takes --stage markup on a correction the developer found at the markup leaf, and rejects it anywhere else', () => {
    expect(correction([ URL, '--correct', '1-2', 'BlockEntity', '--gap', 'shape', '--stage', 'markup' ]).stage).toBe('markup');
    expect(() => parseArgs([ URL, '--correct', '1-2', 'BlockEntity', '--gap', 'shape', '--stage', 'later' ]))
      .toThrow(/Not a gap stage: later; --stage takes one of readout, markup\nUsage:/);
    expect(() => parseArgs([ URL, '--note', 'cells wrap', '--gap', 'markup', '--stage', 'markup' ]))
      .toThrow(/A note is always a markup-stage miss: --stage goes with --correct only\nUsage:/);
    expect(() => parseArgs([ URL, '--override', '1-2', 'bg=x', '--stage', 'markup' ])).toThrow(/--override and --correct are separate runs/);
    expect(() => parseArgs([ URL, '--stage', 'markup' ])).toThrow(/--stage goes with --correct; nothing to log without a correction\nUsage:/);
  });

  it('rejects a correction without --gap, because a correction is always a miss', () => {
    expect(() => parseArgs([ URL, '--correct', '1-2', 'BlockEntity' ]))
      .toThrow(/A correction is always a miss: --correct needs --gap <shape\|icon\|color\|composite\|context\|layout\|convention\|markup>\nUsage:/);
  });

  it('rejects a bad category, a correction with no component, a bad node id, and --gap on its own', () => {
    expect(() => parseArgs([ URL, '--correct', '1-2', 'BlockEntity', '--gap', 'typo' ]))
      .toThrow(/Not a gap category: typo; --gap takes one of shape, icon, color, composite, context, layout, convention, markup\nUsage:/);
    expect(() => parseArgs([ URL, '--correct', '1-2', '--gap', 'shape' ])).toThrow(/--correct 1:2 needs the component the node is, after the URL\nUsage:/);
    expect(() => parseArgs([ URL, '--correct', 'abc', 'BlockEntity', '--gap', 'shape' ])).toThrow(/Not a node id in --correct: abc\nUsage:/);
    expect(() => parseArgs([ URL, '--gap', 'shape' ])).toThrow(/--gap goes with --correct/);
  });
});
