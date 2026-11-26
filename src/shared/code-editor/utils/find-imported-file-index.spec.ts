// SPDX-License-Identifier: LicenseRef-Blockscout

import type { File } from '../types';

import { describe, expect, it } from 'vitest';

import { findImportedFileIndex } from './find-imported-file-index';

const file = (key: string, displayPath: string): File => ({ key, display_path: displayPath, source_code: '' });

describe('with raw paths', () => {
  const files = [
    file('/0', './contracts/Pool.sol'),
    file('/1', 'contracts/Pool.sol'),
    file('/2', 'contracts/libraries/Tick.sol'),
    file('/3', './contracts/libraries/Tick.sol'),
    file('/4', '/contracts/libraries/Tick.sol'),
    file('/5', './contracts/libraries/Math.sol'),
    file('/6', 'node_modules/@openzeppelin/contracts/access/Ownable.sol'),
    file('/7', './node_modules/@openzeppelin/contracts/access/Ownable.sol'),
  ];

  it('opens the twin of the same family for a relative import from a "./" file', () => {
    expect(findImportedFileIndex(files, files[0], './libraries/Tick.sol')).toBe(3);
  });

  it('opens the twin of the same family for a relative import from a prefix-less file', () => {
    expect(findImportedFileIndex(files, files[1], './libraries/Tick.sol')).toBe(2);
  });

  it('opens the twin of the same family for a relative import from a "/" file', () => {
    expect(findImportedFileIndex(files, files[4], './Tick.sol')).toBe(4);
  });

  it('resolves parent directory references inside the family', () => {
    expect(findImportedFileIndex(files, files[3], '../Pool.sol')).toBe(0);
  });

  it('falls back to the first file with the matching normalized path when the family has no such file', () => {
    expect(findImportedFileIndex(files, files[1], './libraries/Math.sol')).toBe(5);
    expect(findImportedFileIndex(files, files[4], '../Pool.sol')).toBe(0);
  });

  it('matches a non-relative import on the normalized path, whatever the family', () => {
    expect(findImportedFileIndex(files, files[0], 'contracts/libraries/Tick.sol')).toBe(2);
  });

  it('matches a remapped import on the normalized path, whatever the family', () => {
    const remappings = [ '@openzeppelin/=node_modules/@openzeppelin/' ];

    expect(findImportedFileIndex(files, files[0], '@openzeppelin/contracts/access/Ownable.sol', remappings)).toBe(6);
  });

  it('applies a remapping context to the normalized path of the importing file', () => {
    const remappings = [ 'contracts:lib/=contracts/libraries/' ];

    expect(findImportedFileIndex(files, files[0], 'lib/Math.sol', remappings)).toBe(5);
  });

  it('returns -1 when no file matches', () => {
    expect(findImportedFileIndex(files, files[0], './libraries/Missing.sol')).toBe(-1);
  });

  it('returns -1 when the import climbs above the root', () => {
    expect(findImportedFileIndex(files, files[0], '../../Pool.sol')).toBe(-1);
  });
});

describe('with normalized paths', () => {
  const files = [
    file('/contracts/Pool.sol', '/contracts/Pool.sol'),
    file('/contracts/libraries/Tick.sol', '/contracts/libraries/Tick.sol'),
    file('/node_modules/@openzeppelin/contracts/access/Ownable.sol', '/node_modules/@openzeppelin/contracts/access/Ownable.sol'),
  ];

  it('finds a relative import', () => {
    expect(findImportedFileIndex(files, files[0], './libraries/Tick.sol')).toBe(1);
    expect(findImportedFileIndex(files, files[1], '../Pool.sol')).toBe(0);
  });

  it('finds a non-relative import', () => {
    expect(findImportedFileIndex(files, files[0], 'contracts/libraries/Tick.sol')).toBe(1);
  });

  it('finds a remapped import', () => {
    const remappings = [ '@openzeppelin/=node_modules/@openzeppelin/' ];

    expect(findImportedFileIndex(files, files[0], '@openzeppelin/contracts/access/Ownable.sol', remappings)).toBe(2);
  });

  it('returns -1 when no file matches', () => {
    expect(findImportedFileIndex(files, files[0], './Missing.sol')).toBe(-1);
  });
});
