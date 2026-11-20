// SPDX-License-Identifier: LicenseRef-Blockscout

import type { File } from '../types';

import { expect, it } from 'vitest';

import { composeFileList } from './compose-file-list';

const file = (key: string, displayPath: string): File => ({ key, display_path: displayPath, source_code: '' });

it('sorts normalized paths alphabetically and shows them without the leading slash', () => {
  const result = composeFileList([
    file('/contracts/Pool.sol', '/contracts/Pool.sol'),
    file('/index.sol', '/index.sol'),
    file('/@openzeppelin/utils/Address.sol', '/@openzeppelin/utils/Address.sol'),
    file('/contracts/libraries/Tick.sol', '/contracts/libraries/Tick.sol'),
  ], { hasRawPaths: false, mainFile: undefined });

  expect(result).toEqual([
    { key: '/@openzeppelin/utils/Address.sol', name: 'Address.sol', directory: '@openzeppelin/utils', path: '@openzeppelin/utils/Address.sol' },
    { key: '/contracts/libraries/Tick.sol', name: 'Tick.sol', directory: 'contracts/libraries', path: 'contracts/libraries/Tick.sol' },
    { key: '/contracts/Pool.sol', name: 'Pool.sol', directory: 'contracts', path: 'contracts/Pool.sol' },
    { key: '/index.sol', name: 'index.sol', directory: '', path: 'index.sol' },
  ]);
});

it('keeps raw paths as they are and puts twins next to each other, ordered by raw path', () => {
  const result = composeFileList([
    file('/0', 'contracts/Pool.sol'),
    file('/1', 'contracts/libraries/Tick.sol'),
    file('/2', './contracts/Asset.sol'),
    file('/3', './contracts/libraries/Tick.sol'),
    file('/4', '/contracts/libraries/Tick.sol'),
    file('/5', 'contracts/Asset.sol'),
  ], { hasRawPaths: true, mainFile: undefined });

  expect(result.map((item) => item.path)).toEqual([
    './contracts/Asset.sol',
    'contracts/Asset.sol',
    './contracts/libraries/Tick.sol',
    '/contracts/libraries/Tick.sol',
    'contracts/libraries/Tick.sol',
    'contracts/Pool.sol',
  ]);
  expect(result.map((item) => item.key)).toEqual([ '/2', '/5', '/3', '/4', '/1', '/0' ]);
});

it('splits a raw path into the file name and the directory, prefix included', () => {
  const result = composeFileList([
    file('/0', 'A.sol'),
    file('/1', './A.sol'),
    file('/2', '/A.sol'),
    file('/3', './contracts/B.sol'),
  ], { hasRawPaths: true, mainFile: undefined });

  expect(result.map(({ name, directory }) => [ name, directory ])).toEqual([
    [ 'A.sol', '.' ],
    [ 'A.sol', '/' ],
    [ 'A.sol', '' ],
    [ 'B.sol', './contracts' ],
  ]);
});

it('puts the main file first, ahead of the sorted files', () => {
  const result = composeFileList([
    file('/0', './contracts/Pool.sol'),
    file('/1', 'contracts/Asset.sol'),
    file('/2', 'contracts/Pool.sol'),
    file('/3', 'contracts/Zap.sol'),
  ], { hasRawPaths: true, mainFile: '/2' });

  expect(result.map((item) => item.path)).toEqual([
    'contracts/Pool.sol',
    'contracts/Asset.sol',
    './contracts/Pool.sol',
    'contracts/Zap.sol',
  ]);
});

it('keeps the main file first when its path sorts after every other path', () => {
  const result = composeFileList([
    file('/contracts/Zap.sol', '/contracts/Zap.sol'),
    file('/contracts/Asset.sol', '/contracts/Asset.sol'),
    file('/contracts/Pool.sol', '/contracts/Pool.sol'),
  ], { hasRawPaths: false, mainFile: '/contracts/Zap.sol' });

  expect(result.map((item) => item.key)).toEqual([ '/contracts/Zap.sol', '/contracts/Asset.sol', '/contracts/Pool.sol' ]);
});

it('does not reorder the given array', () => {
  const files = [ file('/b.sol', '/b.sol'), file('/a.sol', '/a.sol') ];

  composeFileList(files, { hasRawPaths: false, mainFile: undefined });

  expect(files.map((item) => item.key)).toEqual([ '/b.sol', '/a.sol' ]);
});
