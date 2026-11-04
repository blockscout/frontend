// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';
import { getCssText } from 'vitest/utils/cssText';

import TacOperationEntity from './TacOperationEntity';

const ID = '0x9f6e1c3b5a7d9f1e3c5b7a9d1f3e5c7b9a1d3f5e7c9b1a3d5f7e9c1b3a5d7f9e';

const querySpinner = () => document.querySelector('.chakra-spinner');

const getIconCss = () => {
  const icon = document.querySelector('svg');
  if (!icon) {
    throw new Error('icon is expected to render');
  }
  return getCssText(icon);
};

describe('TacOperationEntity', () => {
  afterEach(cleanup);

  it('links to the operation page with the operation icon and a copy button', () => {
    render(<TacOperationEntity id={ ID } status={ tac.V2OperationStatus.success }/>);

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/operation/${ ID }`);
    expect(document.querySelector('use')?.getAttribute('href')).toBe('#operation');
    expect(querySpinner()).toBeNull();
    expect(screen.queryByRole('button', { name: 'copy' })).not.toBeNull();
  });

  it('renders a spinner in place of the icon while the operation is pending', () => {
    render(<TacOperationEntity id={ ID } status={ tac.V2OperationStatus.pending }/>);

    expect(querySpinner()).not.toBeNull();
    expect(document.querySelector('use[href="#operation"]')).toBeNull();
  });

  it('renders a square icon by default', () => {
    render(<TacOperationEntity id={ ID } status={ undefined }/>);

    expect(getIconCss()).toContain('border-radius:var(--chakra-radii-none)');
  });

  it('lets the caller round the icon', () => {
    render(<TacOperationEntity id={ ID } status={ undefined } icon={{ borderRadius: 'md' }}/>);

    expect(getIconCss()).toContain('border-radius:var(--chakra-radii-md)');
  });

  it('keeps the current-chain route inside a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
        <TacOperationEntity id={ ID } status={ undefined }/>
      </MultichainContext.Provider>,
    );

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/operation/${ ID }`);
  });
});
