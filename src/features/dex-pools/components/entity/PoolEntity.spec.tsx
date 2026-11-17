// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as poolMock from 'src/features/dex-pools/mocks/pool';
import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';
import { getCssText } from 'vitest/utils/cssText';

import PoolEntity, * as PoolEntityParts from './PoolEntity';

const pool = poolMock.base;
const TITLE = 'USDT / WETH (0.03%)';
const CONSTANT_TRUNCATION_HEAD = 4;

const getLink = () => screen.getByRole('link');
const getLogos = () => Array.from(document.querySelectorAll('img')).map((img) => img.getAttribute('src'));

describe('PoolEntity', () => {
  afterEach(cleanup);

  it('renders both token logos and the linked title', () => {
    render(<PoolEntity pool={ pool }/>);

    expect(getLink()).toHaveProperty('href', `http://localhost:3000/pools/${ pool.pool_id }`);
    expect(screen.getByText(TITLE)).toBeTruthy();
    expect(getLogos()).toEqual([ pool.base_token_icon_url, pool.quote_token_icon_url ]);
  });

  it('truncates the title at the tail by default', () => {
    render(<PoolEntity pool={ pool }/>);

    expect(getCssText(screen.getByText(TITLE))).toContain('text-overflow:ellipsis');
  });

  it('lets the caller choose the truncation', () => {
    render(<PoolEntity pool={ pool } truncation="constant"/>);

    expect(screen.queryByText(TITLE)).toBeNull();
    expect(screen.getByText(TITLE.slice(0, CONSTANT_TRUNCATION_HEAD), { exact: false })).toBeTruthy();
  });

  it('shows the placeholders when the tokens have no logos', () => {
    render(<PoolEntity pool={ poolMock.noIcons }/>);

    expect(document.querySelectorAll('use[href="#token-placeholder"]')).toHaveLength(2);
  });

  it('noIcon', () => {
    render(<PoolEntity pool={ pool } noIcon/>);

    expect(getLogos()).toEqual([]);
  });

  it('noLink', () => {
    render(<PoolEntity pool={ pool } noLink/>);

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText(TITLE)).toBeTruthy();
  });

  it('keeps the current-chain route inside a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
        <PoolEntity pool={ pool }/>
      </MultichainContext.Provider>,
    );

    expect(getLink()).toHaveProperty('href', `http://localhost:3000/pools/${ pool.pool_id }`);
  });

  it('renders the icon without a root from its own pool', () => {
    render(<PoolEntityParts.Icon pool={ pool } variant="heading"/>);

    expect(getLogos()).toEqual([ pool.base_token_icon_url, pool.quote_token_icon_url ]);
  });

  it('applies style props on the entity and its icon', () => {
    const { container } = render(
      <PoolEntityParts.Container pool={ pool } className="part-container" ml={ 1 }>
        <PoolEntityParts.Icon className="part-icon" ml={ 2 }/>
      </PoolEntityParts.Container>,
    );

    expect(getCssText(container.querySelector('.part-container') as Element)).toContain('margin-left');
    expect(getCssText(container.querySelector('.part-icon') as Element)).toContain('margin-left');
  });
});
