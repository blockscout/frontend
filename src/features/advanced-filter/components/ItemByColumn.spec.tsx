// @vitest-environment jsdom

import React from 'react';

import { tokenInfoERC20a } from 'src/slices/token/mocks/info';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest/lib';

import { baseResponse } from '../mocks';
import ItemByColumn from './ItemByColumn';

const coinTransfer = baseResponse.items[0];
const tokenTransfer = { ...coinTransfer, token: tokenInfoERC20a };
const contractCreation = { ...coinTransfer, to: null, created_contract: coinTransfer.from };

describe('address entity tooltips', () => {
  afterEach(() => cleanup());

  it('renders "from" column for a coin transfer item', () => {
    const { container } = render(<ItemByColumn item={ coinTransfer } column="from"/>);

    expect(container.querySelector('a')?.getAttribute('href')).toContain(coinTransfer.from?.hash ?? '');
  });

  it('renders "from" column for a token transfer item', () => {
    const { container } = render(<ItemByColumn item={ tokenTransfer } column="from"/>);

    expect(container.querySelector('a')?.getAttribute('href')).toContain(coinTransfer.from?.hash ?? '');
  });

  it('renders "to" column for a coin transfer item', () => {
    const { container } = render(<ItemByColumn item={ coinTransfer } column="to"/>);

    expect(container.querySelector('a')?.getAttribute('href')).toContain(coinTransfer.to?.hash ?? '');
  });

  it('falls back to the created contract in the "to" column', () => {
    const { container } = render(<ItemByColumn item={ contractCreation } column="to"/>);

    expect(container.querySelector('a')?.getAttribute('href')).toContain(coinTransfer.from?.hash ?? '');
  });
});
