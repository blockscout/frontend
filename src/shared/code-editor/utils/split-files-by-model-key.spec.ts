import type { File } from '../types';

import { it, expect } from 'vitest';

import { splitFilesByModelKey } from './split-files-by-model-key';

const file = (key: string, sourceCode: string): File => ({ key, display_path: key, source_code: sourceCode });

const MAIN = file('/contracts/Main.sol', 'contract Main {}');
const TICK = file('/contracts/Tick.sol', 'library Tick {}');
const POOL = file('/contracts/Pool.sol', 'contract Pool {}');

it('creates a model for every additional file when no key repeats', () => {
  const result = splitFilesByModelKey([ MAIN, TICK, POOL ], [ MAIN.key ]);

  expect(result).toEqual({ filesToCreate: [ TICK, POOL ], repeatedKeys: [] });
});

it('skips and reports an additional file that repeats the key of the first file', () => {
  const mainTwin = file(MAIN.key, 'contract Main { uint256 a; }');

  const result = splitFilesByModelKey([ MAIN, TICK, mainTwin ], [ MAIN.key ]);

  expect(result).toEqual({ filesToCreate: [ TICK ], repeatedKeys: [ MAIN.key ] });
});

it('reports a repeat of the first file even when its model is not loaded yet', () => {
  const mainTwin = file(MAIN.key, 'contract Main { uint256 a; }');

  const result = splitFilesByModelKey([ MAIN, mainTwin ], []);

  expect(result).toEqual({ filesToCreate: [], repeatedKeys: [ MAIN.key ] });
});

it('keeps the first of the additional files that share a key and reports each later one', () => {
  const tickTwin = file(TICK.key, 'library Tick { uint256 constant A = 1; }');
  const tickTriplet = file(TICK.key, 'library Tick { uint256 constant A = 2; }');

  const result = splitFilesByModelKey([ MAIN, TICK, POOL, tickTwin, tickTriplet ], [ MAIN.key ]);

  expect(result).toEqual({ filesToCreate: [ TICK, POOL ], repeatedKeys: [ TICK.key, TICK.key ] });
});

it('skips a file whose model is already loaded without reporting it', () => {
  const result = splitFilesByModelKey([ MAIN, TICK, POOL ], [ MAIN.key, TICK.key ]);

  expect(result).toEqual({ filesToCreate: [ POOL ], repeatedKeys: [] });
});
