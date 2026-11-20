import { it, expect } from 'vitest';

import getFilePathParts, { hasTwinTab } from './getFilePathParts';

it('computes correct chunks if all file name are unique', () => {
  const result = getFilePathParts(
    '/src/utils/Ownable.sol',
    [
      '/src/utils/EIP712.sol'.split('/'),
      '/src/token/BaseERC20.sol'.split('/'),
    ],
  );

  expect(result).toEqual([ 'Ownable.sol', undefined ]);
});

it('computes correct chunks if files with the same name is not in folders with the same name', () => {
  const result = getFilePathParts(
    '/src/utils/Ownable.sol',
    [
      '/src/utils/EIP712.sol'.split('/'),
      '/lib/_openzeppelin/contracts/contracts/access/Ownable.sol'.split('/'),
    ],
  );

  expect(result).toEqual([ 'Ownable.sol', '/utils' ]);
});

it('computes correct chunks if files with the same name is in folders with the same name', () => {
  const result = getFilePathParts(
    '/src/utils/Ownable.sol',
    [
      '/src/utils/EIP712.sol'.split('/'),
      '/lib/_openzeppelin/contracts/src/utils/Ownable.sol'.split('/'),
    ],
  );

  expect(result).toEqual([ 'Ownable.sol', './src/utils' ]);
});

it('computes correct chunks if file is in root directory', () => {
  const result = getFilePathParts(
    '/Ownable.sol',
    [
      '/src/utils/EIP712.sol'.split('/'),
      '/lib/_openzeppelin/contracts/src/utils/Ownable.sol'.split('/'),
    ],
  );

  expect(result).toEqual([ 'Ownable.sol', './' ]);
});

it('gives twins compact hints that differ by the raw prefix', () => {
  const tabs = [
    './contracts/libraries/Tick.sol'.split('/'),
    'contracts/libraries/Tick.sol'.split('/'),
    '/contracts/libraries/Tick.sol'.split('/'),
    'contracts/Pool.sol'.split('/'),
  ];

  expect(getFilePathParts('./contracts/libraries/Tick.sol', tabs)).toEqual([ 'Tick.sol', './…/libraries' ]);
  expect(getFilePathParts('contracts/libraries/Tick.sol', tabs)).toEqual([ 'Tick.sol', '…/libraries' ]);
  expect(getFilePathParts('/contracts/libraries/Tick.sol', tabs)).toEqual([ 'Tick.sol', '/…/libraries' ]);
  expect(getFilePathParts('contracts/Pool.sol', tabs)).toEqual([ 'Pool.sol', undefined ]);
});

it('does not elide anything for twins in a top-level folder or in the root', () => {
  const folderTwins = [ './contracts/Tick.sol'.split('/'), 'contracts/Tick.sol'.split('/') ];
  const rootTwins = [ './Tick.sol'.split('/'), 'Tick.sol'.split('/') ];

  expect(getFilePathParts('./contracts/Tick.sol', folderTwins)).toEqual([ 'Tick.sol', './contracts' ]);
  expect(getFilePathParts('contracts/Tick.sol', folderTwins)).toEqual([ 'Tick.sol', 'contracts' ]);
  expect(getFilePathParts('./Tick.sol', rootTwins)).toEqual([ 'Tick.sol', './' ]);
  expect(getFilePathParts('Tick.sol', rootTwins)).toEqual([ 'Tick.sol', undefined ]);
});

it('hints a raw path without a twin the same way as its normalized path', () => {
  const tabs = [
    './src/utils/Ownable.sol'.split('/'),
    'lib/_openzeppelin/contracts/src/utils/Ownable.sol'.split('/'),
  ];

  expect(getFilePathParts('./src/utils/Ownable.sol', tabs)).toEqual([ 'Ownable.sol', './src/utils' ]);
  expect(getFilePathParts('lib/_openzeppelin/contracts/src/utils/Ownable.sol', tabs)).toEqual([ 'Ownable.sol', '/src/utils' ]);
});

it('tells whether another open tab is a twin', () => {
  const tabs = [ './contracts/Tick.sol'.split('/'), 'contracts/Tick.sol'.split('/'), 'lib/Tick.sol'.split('/') ];

  expect(hasTwinTab('./contracts/Tick.sol', tabs)).toBe(true);
  expect(hasTwinTab('lib/Tick.sol', tabs)).toBe(false);
});
