// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import ValidatorEntity from './ValidatorEntity';

const ID = '0x9e9a55b5f9a3cd4f1d3b0c5e8b9a7d2f4c6e8a0b2d4f6a8c0e2d4f6a8b0c2d4e';

describe('ValidatorEntity', () => {
  afterEach(cleanup);

  it('links to the validator page with the key icon and a copy button', () => {
    render(<ValidatorEntity id={ ID }/>);

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/validators/${ ID }`);
    expect(document.querySelector('use')?.getAttribute('href')).toBe('#key');
    expect(screen.queryByRole('button', { name: 'copy' })).not.toBeNull();
  });

  it('keeps the current-chain route inside a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
        <ValidatorEntity id={ ID }/>
      </MultichainContext.Provider>,
    );

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/validators/${ ID }`);
  });
});
