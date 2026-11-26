import fs from 'fs';
import os from 'os';
import path from 'path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { FAILURE_MESSAGE, runCheck } from './cli';

let packageDir: string;

function writeFile(file: string, content: string): void {
  const absPath = path.join(packageDir, file);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, content);
}

function writeManifest(manifest: Record<string, unknown>): void {
  writeFile('package.json', JSON.stringify(manifest));
}

beforeEach(() => {
  packageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'toolkit-declarations-'));
});

afterEach(() => {
  fs.rmSync(packageDir, { recursive: true, force: true });
});

describe('runCheck', () => {
  it('exits 0 when every import resolves through dist, the dependencies or the peer dependencies', () => {
    writeManifest({ dependencies: { 'type-fest': '^6.0.1' }, peerDependencies: { react: '>=18' } });
    writeFile('dist/index.d.ts', `export * from './chakra/button';`);
    writeFile('dist/chakra/button.d.ts', `import { default as React } from 'react';\nimport { SetOptional } from 'type-fest';`);

    expect(runCheck(packageDir)).toEqual({
      output: [ { stream: 'out', text: '✓ 2 declaration files, every import resolves' } ],
      exitCode: 0,
    });
  });

  it('exits 1 and names each unresolvable import with its file', () => {
    writeManifest({ peerDependencies: { react: '>=18' } });
    writeFile('dist/index.d.ts', `export * from './hooks/useClipboard';\nexport * from '../../shared/types';`);
    writeFile('dist/utils/consts.d.ts', `import { default as BigNumber } from 'bignumber.js';`);

    expect(runCheck(packageDir)).toEqual({
      output: [
        { stream: 'err', text: `✗ dist/index.d.ts: './hooks/useClipboard' has no declaration file in dist` },
        { stream: 'err', text: `✗ dist/index.d.ts: '../../shared/types' points outside the package` },
        { stream: 'err', text: `✗ dist/utils/consts.d.ts: 'bignumber.js' is not among the dependencies or peer dependencies` },
        { stream: 'err', text: FAILURE_MESSAGE },
      ],
      exitCode: 1,
    });
  });

  it('does not count a development dependency as resolvable', () => {
    writeManifest({ devDependencies: { react: '18.3.1' } });
    writeFile('dist/index.d.ts', `import { default as React } from 'react';`);

    expect(runCheck(packageDir).exitCode).toBe(1);
  });

  it.each([ 'null', '42' ])('reads a manifest of %s as one that declares no packages', (manifest) => {
    writeFile('package.json', manifest);
    writeFile('dist/index.d.ts', `import { default as React } from 'react';`);

    expect(runCheck(packageDir).output[0]).toEqual({
      stream: 'err',
      text: `✗ dist/index.d.ts: 'react' is not among the dependencies or peer dependencies`,
    });
  });

  it('reads a dependencies field of null as one that declares no packages', () => {
    writeManifest({ dependencies: null, peerDependencies: { react: '>=18' } });
    writeFile('dist/index.d.ts', `import { default as React } from 'react';`);

    expect(runCheck(packageDir).exitCode).toBe(0);
  });

  it('ignores files in dist that are not declarations', () => {
    writeManifest({});
    writeFile('dist/index.js', `import x from 'not-declared';`);
    writeFile('dist/index.d.ts', 'export {};');

    expect(runCheck(packageDir).exitCode).toBe(0);
  });

  it('exits 1 when the package is not built', () => {
    writeManifest({});

    const result = runCheck(packageDir);

    expect(result.exitCode).toBe(1);
    expect(result.output[0].text).toContain('Build the package first');
  });
});
