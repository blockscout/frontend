// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as tokenInstanceMock from 'src/slices/token/mocks/instance';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';
import { getCssText } from 'vitest/utils/cssText';

import NftEntity, * as NftEntityParts from './NftEntity';

const HASH = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';
const ID = '1794350723452223';

const getLink = () => screen.getByRole('link');
const getSpriteName = () => document.querySelector('use')?.getAttribute('href');

describe('NftEntity', () => {
  afterEach(cleanup);

  it('renders the shield icon and the linked id without a copy button', () => {
    render(<NftEntity hash={ HASH } id={ ID }/>);

    expect(getLink()).toHaveProperty('href', `http://localhost:3000/token/${ HASH }/instance/${ ID }`);
    expect(screen.getByText(ID)).toBeTruthy();
    expect(getSpriteName()).toBe('#nft_shield');
    expect(screen.queryByRole('button', { name: 'copy' })).toBeNull();
  });

  it('renders nothing from its Copy part', () => {
    render(
      <NftEntityParts.Container hash={ HASH } id={ ID }>
        <NftEntityParts.Copy/>
      </NftEntityParts.Container>,
    );

    expect(screen.queryByRole('button', { name: 'copy' })).toBeNull();
  });

  it('truncates the id at the tail by default', () => {
    render(<NftEntity hash={ HASH } id={ ID }/>);

    expect(getCssText(screen.getByText(ID))).toContain('text-overflow:ellipsis');
  });

  it('lets the caller choose the truncation', () => {
    render(<NftEntity hash={ HASH } id={ ID } truncation="constant"/>);

    expect(screen.queryByText(ID)).toBeNull();
    expect(screen.getByText(ID.slice(0, 4), { exact: false })).toBeTruthy();
  });

  it('draws the shield icon at the heading size in every variant', () => {
    const { container } = render(<NftEntity hash={ HASH } id={ ID } variant="content"/>);

    expect(getCssText(container.querySelector('svg') as Element)).toContain('width:30px');
  });

  it('draws the instance media in place of the shield icon', () => {
    render(<NftEntity hash={ HASH } id={ ID } instance={ tokenInstanceMock.base }/>);

    expect(getSpriteName()).toBeUndefined();
  });

  it('noIcon', () => {
    render(<NftEntity hash={ HASH } id={ ID } noIcon/>);

    expect(getSpriteName()).toBeUndefined();
  });

  it('noLink', () => {
    render(<NftEntity hash={ HASH } id={ ID } noLink/>);

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText(ID)).toBeTruthy();
  });

  it('links to the chain-scoped route inside a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
        <NftEntity hash={ HASH } id={ ID }/>
      </MultichainContext.Provider>,
    );

    expect(getLink()).toHaveProperty('href', `http://localhost:3000/chain/op-mainnet/token/${ HASH }/instance/${ ID }`);
  });

  it('applies style props on the entity and its icon', () => {
    const { container } = render(
      <NftEntityParts.Container hash={ HASH } id={ ID } className="part-container" ml={ 1 }>
        <NftEntityParts.Icon className="part-icon" ml={ 2 }/>
      </NftEntityParts.Container>,
    );

    expect(getCssText(container.querySelector('.part-container') as Element)).toContain('margin-left');
    expect(getCssText(container.querySelector('.part-icon') as Element)).toContain('margin-left');
  });

  it('applies style props on the instance media', () => {
    const { container } = render(
      <NftEntityParts.Container hash={ HASH } id={ ID } instance={ tokenInstanceMock.base }>
        <NftEntityParts.Icon className="part-icon" mr="5px"/>
      </NftEntityParts.Container>,
    );

    expect(getCssText(container.querySelector('.part-icon') as Element)).toContain('margin-right:5px');
  });
});
