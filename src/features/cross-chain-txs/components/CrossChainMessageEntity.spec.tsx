// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest/lib';

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
});
