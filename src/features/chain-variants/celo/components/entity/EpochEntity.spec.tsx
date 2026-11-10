// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import EpochEntity from './EpochEntity';

const NUMBER = '1234';

const queryCopy = () => screen.queryByRole('button', { name: 'copy' });

describe('EpochEntity', () => {
  afterEach(cleanup);

  it('links to the epoch page and shows the hourglass icon', () => {
    render(<EpochEntity number={ NUMBER }/>);

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/epochs/${ NUMBER }`);
    expect(document.querySelector('use')?.getAttribute('href')).toBe('#hourglass');
    expect(screen.getByText(NUMBER)).toBeTruthy();
  });

  it('hides the copy button by default', () => {
    render(<EpochEntity number={ NUMBER }/>);

    expect(queryCopy()).toBeNull();
  });

  it('shows the copy button when the caller asks for it', () => {
    render(<EpochEntity number={ NUMBER } noCopy={ false }/>);

    expect(queryCopy()).not.toBeNull();
  });

  it('keeps the current-chain route inside a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
        <EpochEntity number={ NUMBER }/>
      </MultichainContext.Provider>,
    );

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/epochs/${ NUMBER }`);
  });
});
