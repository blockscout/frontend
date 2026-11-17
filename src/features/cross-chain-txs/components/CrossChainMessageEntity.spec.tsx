// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import CrossChainMessageEntity from './CrossChainMessageEntity';

const MESSAGE_ID = '0x057b42bbbfbb4900e155a554ae67632cb21e6f5a64d815fcad7f33abe552c059';
const BRIDGE_ID = 2;
// the entity truncates the id in the middle, so only its ends survive in the rendered text
const MESSAGE_ID_TAIL = MESSAGE_ID.slice(-4);

describe('CrossChainMessageEntity', () => {
  afterEach(cleanup);

  it('links to the message within its bridge', () => {
    const { container } = render(<CrossChainMessageEntity id={ MESSAGE_ID } bridgeId={ BRIDGE_ID }/>);

    expect(container.querySelector('a')?.getAttribute('href')).toBe(`/bridge/${ BRIDGE_ID }/cross-chain-tx/${ MESSAGE_ID }`);
  });

  it('renders unlinked when the bridge is unknown', () => {
    const { container } = render(<CrossChainMessageEntity id={ MESSAGE_ID } bridgeId={ undefined }/>);

    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toContain(MESSAGE_ID_TAIL);
  });

  it('hides the icon by default', () => {
    render(<CrossChainMessageEntity id={ MESSAGE_ID } bridgeId={ BRIDGE_ID }/>);

    expect(document.querySelector('use[href="#interop"]')).toBeNull();
  });

  it('shows the interop icon when the caller asks for it', () => {
    render(<CrossChainMessageEntity id={ MESSAGE_ID } bridgeId={ BRIDGE_ID } noIcon={ false }/>);

    expect(document.querySelector('use')?.getAttribute('href')).toBe('#interop');
  });

  it('truncates the id to a constant length by default', () => {
    render(<CrossChainMessageEntity id={ MESSAGE_ID } bridgeId={ BRIDGE_ID }/>);

    expect(screen.queryByText(MESSAGE_ID)).toBeNull();
    expect(screen.getByText(MESSAGE_ID_TAIL, { exact: false })).toBeTruthy();
  });

  it('shows the whole id when the caller disables truncation', () => {
    render(<CrossChainMessageEntity id={ MESSAGE_ID } bridgeId={ BRIDGE_ID } truncation="none"/>);

    expect(screen.getByText(MESSAGE_ID)).toBeTruthy();
  });

  it('keeps the current-chain route inside a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
        <CrossChainMessageEntity id={ MESSAGE_ID } bridgeId={ BRIDGE_ID }/>
      </MultichainContext.Provider>,
    );

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/bridge/${ BRIDGE_ID }/cross-chain-tx/${ MESSAGE_ID }`);
  });
});
