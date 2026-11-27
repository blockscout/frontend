// @vitest-environment jsdom

import React from 'react';

import * as txMock from 'src/slices/tx/mocks/list';

import { MultichainContext } from 'src/features/multichain/context';
import { chainA } from 'src/features/multichain/mocks/chains';

import { EventTypes } from 'src/shared/analytics';
import * as analyticsQueue from 'src/shared/analytics/queue';

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from 'vitest/lib';

import TxAdditionalInfoContent from './TxAdditionalInfoContent';

const HASH = txMock.base.hash;

afterEach(() => {
  cleanup();
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

    const track = vi.spyOn(analyticsQueue, 'track');
    fireEvent.click(screen.getByRole('link', { name: 'Receipt' }));

    expect(track).toHaveBeenCalledWith(EventTypes.BUTTON_CLICK, { Content: 'Receipt', Source: 'Additional info' }, undefined);
  });
});
