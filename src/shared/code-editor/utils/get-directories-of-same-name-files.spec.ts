// SPDX-License-Identifier: LicenseRef-Blockscout

import { expect, it } from 'vitest';

import { getDirectoriesOfSameNameFiles } from './get-directories-of-same-name-files';

it('gives a directory only to the files that share a name with another file', () => {
  const result = getDirectoriesOfSameNameFiles([
    { key: '/contracts/Pool.sol', display_path: '/contracts/Pool.sol' },
    { key: '/contracts/utils/Ownable.sol', display_path: '/contracts/utils/Ownable.sol' },
    { key: '/lib/access/Ownable.sol', display_path: '/lib/access/Ownable.sol' },
  ], false);

  expect(Array.from(result)).toEqual([
    [ '/contracts/utils/Ownable.sol', 'contracts/utils' ],
    [ '/lib/access/Ownable.sol', 'lib/access' ],
  ]);
});

it('keeps the raw prefix in the directories of twins', () => {
  const result = getDirectoriesOfSameNameFiles([
    { key: '/0', display_path: './contracts/libraries/Tick.sol' },
    { key: '/1', display_path: 'contracts/libraries/Tick.sol' },
    { key: '/2', display_path: 'contracts/Pool.sol' },
  ], true);

  expect(Array.from(result)).toEqual([
    [ '/0', './contracts/libraries' ],
    [ '/1', 'contracts/libraries' ],
  ]);
});

it('gives no directories when every file name is unique', () => {
  const result = getDirectoriesOfSameNameFiles([
    { key: '/a/A.sol', display_path: '/a/A.sol' },
    { key: '/b/B.sol', display_path: '/b/B.sol' },
  ], false);

  expect(result.size).toBe(0);
});
