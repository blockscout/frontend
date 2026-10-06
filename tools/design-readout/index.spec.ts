import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import { dumpPayload, parseArgs } from './index';

const URL = 'https://www.figma.com/design/abcDEF0123456789abcDEF/Pages?node-id=22842-174340';

describe('parseArgs', () => {
  it('takes the node URL as the one positional and --dump in both forms', () => {
    expect(parseArgs([ URL ])).toEqual({ options: { dump: undefined }, ref: { fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' } });
    expect(parseArgs([ URL, '--dump', 'out.json' ]).options.dump).toBe('out.json');
    expect(parseArgs([ '--dump=out.json', URL ]).options.dump).toBe('out.json');
  });

  it('rejects a missing, extra or malformed URL with the usage line', () => {
    expect(() => parseArgs([])).toThrow(/Missing the Figma node URL\nUsage:/);
    expect(() => parseArgs([ URL, URL ])).toThrow(/Unexpected argument/);
    expect(() => parseArgs([ '22842:174340' ])).toThrow(/Not a Figma node URL: 22842:174340\nUsage:/);
    expect(() => parseArgs([ URL, '--json' ])).toThrow(/Unknown flag: --json/);
  });
});

describe('dumpPayload', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-'));

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('writes the payload as JSON at the path resolved from cwd, creating folders', () => {
    const payload = { name: 'f', lastModified: 'm', version: 'v', nodes: {} };
    const file = dumpPayload('nested/out.json', payload, dir);
    expect(file).toBe(path.join(dir, 'nested/out.json'));
    expect(JSON.parse(fs.readFileSync(file, 'utf8'))).toEqual(payload);
  });
});
