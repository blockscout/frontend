// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import React from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from 'vitest/lib';
import { routerStandIn } from 'vitest/utils/routerStandIn';

import * as advancedFilterMock from '../../mocks';
import AdvancedFilter from './AdvancedFilter';

vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));

const STORAGE_KEY = 'table_columns_advanced_filter';

beforeEach(() => {
  fetchMock.resetMocks();
  fetchMock.mockResponse((request) => {
    if (new URL(request.url).pathname === '/api/v2/advanced-filters') {
      return { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(advancedFilterMock.baseResponse) };
    }
    return { status: 404, body: '{}' };
  });
  routerStandIn.reset({ pathname: '/advanced-filter', query: {} });
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

async function renderPage() {
  render(<AdvancedFilter/>);
  await waitFor(() => expect(document.querySelectorAll('tbody tr').length).toBeGreaterThan(0));
}

function getHeaderNames() {
  return Array.from(document.querySelectorAll('thead th')).map((header) => header.textContent);
}

describe('advanced filter page, column settings', () => {
  it('renders the table with the stored columns', async() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ visibility: { method: false }, order: [ 'fee', 'tx_hash' ] }));

    await renderPage();

    const headers = getHeaderNames();
    expect(headers.slice(0, 2)).toEqual([ 'Fee', 'Tx hash' ]);
    expect(headers).not.toContain('Method');
  });

  it('neither renders nor offers the multiplier column on a chain without the UI multiplier', async() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ visibility: { multiplier: true }, order: [ 'multiplier' ] }));

    await renderPage();

    expect(getHeaderNames()).not.toContain('Multiplier');
    fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
    expect(await screen.findByRole('checkbox', { name: 'Fee' })).toBeTruthy();
    expect(screen.queryByRole('checkbox', { name: 'Multiplier' })).toBeNull();
  });
});
