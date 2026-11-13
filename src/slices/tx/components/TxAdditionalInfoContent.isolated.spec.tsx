// @vitest-environment jsdom

import React from 'react';

import * as txMock from 'src/slices/tx/mocks/list';

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

import TxAdditionalInfoContent from './TxAdditionalInfoContent';

const HASH = txMock.base.hash;

afterEach(() => {
  cleanup();
  logEventMock.mockClear();
});

describe('receipt entry point in the "Additional info" dropdown', () => {
  it('opens the receipt in a new tab', () => {
    render(<TxAdditionalInfoContent tx={ txMock.base }/>);

    const link = screen.getByRole('link', { name: 'Receipt' });
    expect(link.getAttribute('href')).toBe(`/tx/${ HASH }/receipt`);
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('links the receipt of the transaction\'s chain in multichain mode', () => {
    render(
      <MultichainContext.Provider value={{ chain: chainA }}>
        <TxAdditionalInfoContent tx={ txMock.base }/>
      </MultichainContext.Provider>,
    );

    expect(screen.getByRole('link', { name: 'Receipt' }).getAttribute('href')).toBe(`/chain/${ chainA.slug }/tx/${ HASH }/receipt`);
  });

  it('reports the click with the dropdown as its source', () => {
    render(<TxAdditionalInfoContent tx={ txMock.base }/>);

    fireEvent.click(screen.getByRole('link', { name: 'Receipt' }));

    expect(logEventMock).toHaveBeenCalledWith(EventTypes.BUTTON_CLICK, { Content: 'Receipt', Source: 'Additional info' });
  });
});
