// SPDX-License-Identifier: LicenseRef-Blockscout

import { expect, it } from 'vitest';

import { getBreadcrumbChunks } from './get-breadcrumb-chunks';

it('shows a normalized path without the leading slash', () => {
  expect(getBreadcrumbChunks('/contracts/A.sol', false)).toEqual([ 'contracts', 'A.sol' ]);
});

it('keeps the raw prefix of twins, so each twin has its own crumbs', () => {
  expect(getBreadcrumbChunks('/contracts/A.sol', true)).toEqual([ '/', 'contracts', 'A.sol' ]);
  expect(getBreadcrumbChunks('./contracts/A.sol', true)).toEqual([ '.', 'contracts', 'A.sol' ]);
  expect(getBreadcrumbChunks('contracts/A.sol', true)).toEqual([ 'contracts', 'A.sol' ]);
});
