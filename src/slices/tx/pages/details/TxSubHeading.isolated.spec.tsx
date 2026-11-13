// @vitest-environment jsdom

import React from 'react';

import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';
import * as txMock from 'src/slices/tx/mocks/details';

import { MultichainContext } from 'src/features/multichain/context';
import { chainA } from 'src/features/multichain/mocks/chains';

import { EventTypes } from 'src/shared/analytics';

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from 'vitest/lib';

const logEventMock = vi.hoisted(() => vi.fn());

vi.mock('src/shared/analytics', async(importOriginal) => ({
  ...await importOriginal<object>(),
  logEvent: logEventMock,
}));

import TxSubHeading from './TxSubHeading';

const HASH = txMock.base.hash;

const txQuery = {
  data: txMock.base,
  isPlaceholderData: false,
  isError: false,
} as TxQuery;

afterEach(() => {
  cleanup();
  logEventMock.mockClear();
});

describe('receipt entry point on the transaction page', () => {
  it.each([ false, true ])('opens the receipt in a new tab when hasTag is %s', (hasTag) => {
    render(<TxSubHeading hash={ HASH } hasTag={ hasTag } txQuery={ txQuery }/>);

    const link = screen.getByRole('link', { name: 'Receipt' });
    expect(link.getAttribute('href')).toBe(`/tx/${ HASH }/receipt`);
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('links the receipt of the transaction\'s chain in multichain mode', () => {
    render(
      <MultichainContext.Provider value={{ chain: chainA }}>
        <TxSubHeading hash={ HASH } hasTag={ false } txQuery={ txQuery }/>
      </MultichainContext.Provider>,
    );

    expect(screen.getByRole('link', { name: 'Receipt' }).getAttribute('href')).toBe(`/chain/${ chainA.slug }/tx/${ HASH }/receipt`);
  });

  it('reports the click with the transaction page as its source', () => {
    render(<TxSubHeading hash={ HASH } hasTag={ false } txQuery={ txQuery }/>);

    fireEvent.click(screen.getByRole('link', { name: 'Receipt' }));

    expect(logEventMock).toHaveBeenCalledWith(EventTypes.BUTTON_CLICK, { Content: 'Receipt', Source: 'Transaction details' });
  });
});
