// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as addressMock from 'src/slices/address/mocks/address-param';

import { txInterpretation } from 'src/features/tx-interpretation/blockscout/mocks';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import type { NonStringTxInterpretationVariable } from './TxInterpretationElementByType';
import TxInterpretationElementByType from './TxInterpretationElementByType';

const TOKEN_VARIABLE = txInterpretation.data.summaries[0].summary_template_variables.token as NonStringTxInterpretationVariable;

const LINKED_VARIABLES: Record<string, NonStringTxInterpretationVariable> = {
  address: { type: 'address', value: addressMock.withoutName },
  token: TOKEN_VARIABLE,
  'market with a site': { type: 'dexTag', value: { name: 'Uniswap', icon: '', url: 'https://uniswap.example' } },
  link: { type: 'link', value: { name: 'Docs', url: 'https://docs.example' } },
  'external link': { type: 'external_link', value: { name: 'Forum', link: 'https://forum.example' } },
};

const PLAIN_VARIABLES: Record<string, NonStringTxInterpretationVariable> = {
  domain: { type: 'domain', value: 'duck.eth' },
  currency: { type: 'currency', value: '100' },
  timestamp: { type: 'timestamp', value: '1687005431' },
  method: { type: 'method', value: 'Multicall' },
};

const VISIBLE_TEXT: Record<string, string> = {
  address: '0xd7...5859',
  token: 'DUCK',
  'market with a site': 'Uniswap',
  link: 'Docs',
  'external link': 'Forum',
  domain: 'duck.eth',
  currency: '100',
  timestamp: 'Jun 17 2023',
  method: 'Multicall',
};

describe('TxInterpretationElementByType', () => {
  afterEach(cleanup);

  it.each(Object.keys(LINKED_VARIABLES))('links the %s by default', (name) => {
    render(<TxInterpretationElementByType variable={ LINKED_VARIABLES[name] }/>);

    expect(screen.getByRole('link').textContent).toContain(VISIBLE_TEXT[name]);
  });

  it.each(Object.keys(PLAIN_VARIABLES))('shows the %s as plain content', (name) => {
    render(<TxInterpretationElementByType variable={ PLAIN_VARIABLES[name] }/>);

    expect(screen.getByText(VISIBLE_TEXT[name], { exact: false })).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('shows the address data from the map when the map knows the address', () => {
    const addressDataMap = { [addressMock.hash]: addressMock.withName };

    render(<TxInterpretationElementByType variable={ LINKED_VARIABLES.address } addressDataMap={ addressDataMap }/>);

    expect(screen.getByText(String(addressMock.withName.name))).toBeTruthy();
  });

  it('renders nothing without a variable', () => {
    const { container } = render(<TxInterpretationElementByType/>);

    expect(container.querySelector('span, a, img')).toBeNull();
  });
});
