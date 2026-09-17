// @vitest-environment jsdom

import React from 'react';

import { tokenInfoERC20a } from 'src/slices/token/mocks/info';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from 'vitest/lib';

import { baseResponse } from '../mocks';
import ItemByColumn from './ItemByColumn';

const coinTransfer = baseResponse.items[0];
const tokenTransfer = { ...coinTransfer, token: tokenInfoERC20a };
const contractCreation = { ...coinTransfer, to: null, created_contract: coinTransfer.from };
const tokenTransferTooltip = 'View all token transfers for this address and token';

const openAddressTooltip = async() => {
  const getAddressLink = () => screen.getAllByRole('link').find(link => link.getAttribute('href')?.startsWith('/address/')) as HTMLElement;
  const getTextElement = () => getAddressLink().querySelector('span') as HTMLElement;
  const initialTextElement = getTextElement();

  fireEvent.pointerEnter(initialTextElement, { pointerType: 'mouse' });
  // jsdom does not preserve :hover when the lazy tooltip remounts its trigger.
  await waitFor(() => expect(initialTextElement.isConnected).toBe(false));
  fireEvent.pointerEnter(getTextElement(), { pointerType: 'mouse' });
};

describe('address entity tooltips', () => {
  afterEach(() => cleanup());

  it('does not render the token-transfer tooltip for a coin transfer "from" column', async() => {
    render(<ItemByColumn item={ coinTransfer } column="from"/>);
    await openAddressTooltip();
    await screen.findByText(coinTransfer.from?.hash ?? '');

    expect(screen.queryByText(tokenTransferTooltip)).toBeNull();
  });

  it('renders the token-transfer tooltip for a token transfer "from" column', async() => {
    render(<ItemByColumn item={ tokenTransfer } column="from"/>);
    await openAddressTooltip();

    expect(await screen.findByText(tokenTransferTooltip)).toBeDefined();
  });

  it('does not render the token-transfer tooltip for a coin transfer "to" column', async() => {
    render(<ItemByColumn item={ coinTransfer } column="to"/>);
    await openAddressTooltip();
    await screen.findByText(coinTransfer.to?.hash ?? '');

    expect(screen.queryByText(tokenTransferTooltip)).toBeNull();
  });

  it('renders the token-transfer tooltip for a token transfer "to" column', async() => {
    render(<ItemByColumn item={ tokenTransfer } column="to"/>);
    await openAddressTooltip();

    expect(await screen.findByText(tokenTransferTooltip)).toBeDefined();
  });

  it('does not render the token-transfer tooltip when falling back to a created contract', async() => {
    render(<ItemByColumn item={ contractCreation } column="to"/>);
    await openAddressTooltip();
    await screen.findByText(coinTransfer.from?.hash ?? '');

    expect(screen.queryByText(tokenTransferTooltip)).toBeNull();
  });
});
