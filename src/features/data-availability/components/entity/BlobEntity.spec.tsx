// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';
import { getCssText } from 'vitest/utils/cssText';

import BlobEntity from './BlobEntity';

const HASH = '0x0137cd898a9aaa0be8d79dce7a6d5e0e0e1c9a2b3c4d5e6f708192a3b4c5d6e7';

const getIconCss = () => {
  const icon = document.querySelector('svg');
  if (!icon) {
    throw new Error('icon is expected to render');
  }
  return getCssText(icon);
};

describe('BlobEntity', () => {
  afterEach(cleanup);

  it('links to the blob page with its icon and a copy button', () => {
    render(<BlobEntity hash={ HASH }/>);

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/blobs/${ HASH }`);
    expect(document.querySelector('use')?.getAttribute('href')).toBe('#blob');
    expect(screen.queryByRole('button', { name: 'copy' })).not.toBeNull();
  });

  it('renders a square icon by default', () => {
    render(<BlobEntity hash={ HASH }/>);

    expect(getIconCss()).toContain('border-radius:var(--chakra-radii-none)');
  });

  it('lets the caller round the icon', () => {
    render(<BlobEntity hash={ HASH } icon={{ borderRadius: 'md' }}/>);

    expect(getIconCss()).toContain('border-radius:var(--chakra-radii-md)');
  });

  it('shows the given text instead of the hash', () => {
    render(<BlobEntity hash={ HASH } text="Blob #1" truncation="none"/>);

    expect(screen.getByText('Blob #1')).toBeTruthy();
  });

  it('links to the chain-scoped page inside a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
        <BlobEntity hash={ HASH }/>
      </MultichainContext.Provider>,
    );

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/chain/op-mainnet/blobs/${ HASH }`);
  });
});
