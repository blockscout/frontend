// @vitest-environment jsdom

import React from 'react';

import { tokenInfoERC20a } from 'src/slices/token/mocks/info';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import { baseResponse } from '../mocks';
import ItemByColumn from './ItemByColumn';

vi.mock('src/slices/address/components/entity/AddressEntity', () => ({
  'default': ({ address }: { address: { hash: string } }) => <span data-testid="address-entity">{ address.hash }</span>,
}));

vi.mock('src/slices/address/components/entity/AddressEntityWithTokenFilter', () => ({
  'default': ({ address, tokenHash }: { address: { hash: string }; tokenHash: string }) => (
    <span data-testid="address-entity-with-token-filter" data-token-hash={ tokenHash }>{ address.hash }</span>
  ),
}));

const coinTransfer = baseResponse.items[0];
const tokenTransfer = { ...coinTransfer, token: tokenInfoERC20a };
const contractCreation = { ...coinTransfer, to: null, created_contract: coinTransfer.from };

describe('address entity tooltips', () => {
  afterEach(() => cleanup());

  it('renders the regular address entity for a coin transfer "from" column', () => {
    render(<ItemByColumn item={ coinTransfer } column="from"/>);

    expect(screen.getByTestId('address-entity').textContent).toBe(coinTransfer.from?.hash ?? '');
    expect(screen.queryByTestId('address-entity-with-token-filter')).toBeNull();
  });

  it('renders the token-filter address entity for a token transfer "from" column', () => {
    render(<ItemByColumn item={ tokenTransfer } column="from"/>);

    expect(screen.getByTestId('address-entity-with-token-filter').getAttribute('data-token-hash')).toBe(tokenInfoERC20a.address_hash);
    expect(screen.queryByTestId('address-entity')).toBeNull();
  });

  it('renders the regular address entity for a coin transfer "to" column', () => {
    render(<ItemByColumn item={ coinTransfer } column="to"/>);

    expect(screen.getByTestId('address-entity').textContent).toBe(coinTransfer.to?.hash ?? '');
    expect(screen.queryByTestId('address-entity-with-token-filter')).toBeNull();
  });

  it('renders the token-filter address entity for a token transfer "to" column', () => {
    render(<ItemByColumn item={ tokenTransfer } column="to"/>);

    expect(screen.getByTestId('address-entity-with-token-filter').getAttribute('data-token-hash')).toBe(tokenInfoERC20a.address_hash);
    expect(screen.queryByTestId('address-entity')).toBeNull();
  });

  it('uses the regular address entity when falling back to a created contract', () => {
    render(<ItemByColumn item={ contractCreation } column="to"/>);

    expect(screen.getByTestId('address-entity').textContent).toBe(coinTransfer.from?.hash ?? '');
    expect(screen.queryByTestId('address-entity-with-token-filter')).toBeNull();
  });
});
