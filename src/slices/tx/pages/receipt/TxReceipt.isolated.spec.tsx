// @vitest-environment jsdom

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { SocketProvider } from 'src/api/socket/context';

import * as txMock from 'src/slices/tx/mocks/details';

import { EventTypes } from 'src/shared/analytics';

import { SECOND } from 'src/toolkit/utils/consts';
import { nbsp } from 'src/toolkit/utils/htmlEntities';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act, waitFor, fireEvent, within } from 'vitest/lib';
import { mockApiAndRpc, rpcRequests } from 'vitest/utils/mockJsonRpc';
import { MOCK_SOCKET_URL, sendSocketMessage } from 'vitest/utils/mockSocket';
import { routerStandIn, RouterStandInProvider } from 'vitest/utils/routerStandIn';

const logEventMock = vi.hoisted(() => vi.fn());

vi.mock('src/shared/analytics', async(importOriginal) => ({
  ...await importOriginal<object>(),
  logEvent: logEventMock,
}));

vi.mock('phoenix', () => import('vitest/utils/mockSocket').then((m) => m.phoenixModule));

import TxReceipt from './TxReceipt';

const HASH = txMock.base.hash;
const TX_URL_PART = `/transactions/${ HASH }`;
const RECEIPT_URL = `http://localhost:3000/tx/${ HASH }/receipt`;

// the backend waits for the block before the transaction is re-read, and the hook mirrors that delay
const STATUS_UPDATE_DELAY = 5 * SECOND;

const writeTextMock = vi.fn();

beforeEach(() => {
  fetchMock.resetMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.stubEnv('TZ', 'UTC');
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: writeTextMock.mockResolvedValue(undefined) }, configurable: true });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  logEventMock.mockClear();
  writeTextMock.mockReset();
  Reflect.deleteProperty(navigator, 'clipboard');
});

function mockTx(getTx: () => schemas['TransactionResponse']) {
  mockApiAndRpc({ api: (url) => url.includes(TX_URL_PART) ? { body: JSON.stringify(getTx()) } : { status: 404, body: '{}' } });
}

function renderReceipt() {
  routerStandIn.reset({ pathname: '/tx/[hash]/receipt', query: { hash: HASH } });
  return render(
    <RouterStandInProvider>
      <SocketProvider url={ MOCK_SOCKET_URL }>
        <TxReceipt/>
      </SocketProvider>
    </RouterStandInProvider>,
  );
}

function getRowValue(label: string) {
  return screen.getByText(label, { selector: 'dt' }).nextElementSibling?.textContent;
}

// an identicon keeps its own skeleton until the image loads, which never happens in jsdom
async function waitForLoaded() {
  await waitFor(() => expect(document.querySelector('dd[data-loading]')).toBeNull());
}

describe('transaction receipt', () => {
  it('shows the status and the details of a settled transaction', async() => {
    mockTx(() => txMock.base);
    renderReceipt();
    await waitForLoaded();

    expect(screen.getByText('Success')).toBeTruthy();
    expect(getRowValue('Date')).toBe('Oct 10 2022');
    expect(getRowValue('Time')).toBe(`14:34:30 (+00:00${ nbsp }UTC)`);
    expect(getRowValue('Tx fee')).toMatch(/^0\.007143168\s*ETH\s*\(<\s*\$0\.01\)$/);
    expect(getRowValue('Chain')).toBe('Blockscout');
    expect(getRowValue('Tx hash')).toBe('0x62...3193');
  });

  it('shows the failed status of a reverted transaction', async() => {
    mockTx(() => txMock.withRevertReasonParam);
    renderReceipt();
    await waitForLoaded();

    expect(screen.getByText('Failed')).toBeTruthy();
  });

  it('shows a spinner and dashes for the date and time of a pending transaction', async() => {
    mockTx(() => txMock.pending);
    renderReceipt();
    await waitForLoaded();

    expect(screen.getByRole('status', { name: 'Pending' })).toBeTruthy();
    expect(getRowValue('Date')).toBe('-');
    expect(getRowValue('Time')).toBe('-');
  });

  it('turns a pending transaction into its final status when the block is collated', async() => {
    let tx = txMock.pending;
    mockTx(() => tx);
    renderReceipt();
    await waitForLoaded();

    tx = txMock.base;
    // the channel joins after the transaction renders; the send throws until the subscription is in place
    await waitFor(() => sendSocketMessage(`transactions:${ HASH }`, 'collated', {}));
    await act(() => vi.advanceTimersByTimeAsync(STATUS_UPDATE_DELAY));

    expect(await screen.findByText('Success')).toBeTruthy();
    expect(screen.queryByRole('status', { name: 'Pending' })).toBeNull();
    expect(getRowValue('Date')).toBe('Oct 10 2022');
  });

  it('shows the fee in USD when the exchange rate is known', async() => {
    mockTx(() => ({ ...txMock.base, exchange_rate: '2000', historic_exchange_rate: null }));
    renderReceipt();
    await waitForLoaded();

    expect(getRowValue('Tx fee')).toMatch(/\(\$14\.29\)$/);
  });

  it('shows no USD value when the exchange rate is unknown', async() => {
    mockTx(() => ({ ...txMock.base, exchange_rate: null, historic_exchange_rate: null }));
    renderReceipt();
    await waitForLoaded();

    expect(getRowValue('Tx fee')).not.toContain('$');
  });
});

describe('transaction receipt summary without an interpretation', () => {
  function getSummary() {
    return within(screen.getByRole('region', { name: 'Transaction summary' }));
  }

  it('shows a call to a contract with its method, the parties joined by "interacted with"', async() => {
    mockTx(() => txMock.withRawRevertReason);
    renderReceipt();
    await waitForLoaded();

    const summary = getSummary();
    expect(summary.getByRole('heading').textContent).toBe('Call');
    expect(summary.getByText('updateSmartAsset')).toBeTruthy();
    expect(summary.getByText('interacted with')).toBeTruthy();
    expect(summary.getByText('Bad guy')).toBeTruthy();
  });

  it('marks the called contract with the contract icon', async() => {
    mockTx(() => txMock.withRawRevertReason);
    renderReceipt();
    await waitForLoaded();

    const icons = [ ...screen.getByRole('region', { name: 'Transaction summary' }).querySelectorAll('use') ].map((use) => use.getAttribute('href'));
    expect(icons.some((href) => href?.endsWith('#contracts/verified'))).toBe(true);
  });

  it('describes a contract call without a method', async() => {
    mockTx(() => ({ ...txMock.withRawRevertReason, method: null }));
    renderReceipt();
    await waitForLoaded();

    expect(getSummary().getByText('Executed a contract call')).toBeTruthy();
  });

  it('shows the native coin transfer of a transaction to a non-contract, the parties joined by "to"', async() => {
    mockTx(() => txMock.base);
    renderReceipt();
    await waitForLoaded();

    const summary = getSummary();
    expect(summary.getByRole('heading').textContent).toBe('Transfer');
    expect(summary.getByText('42')).toBeTruthy();
    expect(summary.getByText('ETH')).toBeTruthy();
    expect(summary.getByText('to')).toBeTruthy();
  });

  it('shows a transfer of zero for a pending transaction', async() => {
    mockTx(() => txMock.pending);
    renderReceipt();
    await waitForLoaded();

    const summary = getSummary();
    expect(summary.getByRole('heading').textContent).toBe('Transfer');
    expect(summary.getByText('0')).toBeTruthy();
  });

  it.each([
    [ 'call', txMock.withRawRevertReason ],
    [ 'transfer', txMock.base ],
  ])('links nothing in the %s summary', async(_, tx) => {
    mockTx(() => tx);
    renderReceipt();
    await waitForLoaded();

    expect(screen.getByRole('region', { name: 'Transaction summary' }).querySelector('a')).toBeNull();
  });
});

describe('transaction receipt on a failed request', () => {
  it.each([ 404, 422, 500 ])('redirects to the transaction page on a %i without asking the RPC node', async(status) => {
    mockApiAndRpc({ api: () => ({ status, body: '{}' }) });
    renderReceipt();

    await act(() => vi.advanceTimersByTimeAsync(10 * SECOND));

    await waitFor(() => expect(routerStandIn.pathname).toBe('/tx/[hash]'));
    expect(routerStandIn.query).toEqual({ hash: HASH });
    expect(rpcRequests()).toEqual([]);
  });
});

describe('transaction receipt actions', () => {
  it('links only the transaction details, to the transaction page in a new tab', async() => {
    mockTx(() => txMock.base);
    const { container } = renderReceipt();
    await waitForLoaded();

    const anchors = container.querySelectorAll('a');
    expect(anchors).toHaveLength(1);
    expect(anchors[0].textContent).toBe('Transaction details');
    expect(anchors[0].getAttribute('href')).toBe(`/tx/${ HASH }`);
    expect(anchors[0].getAttribute('target')).toBe('_blank');
  });

  it('reports the transaction details click', async() => {
    mockTx(() => txMock.base);
    renderReceipt();
    await waitForLoaded();

    fireEvent.click(screen.getByText('Transaction details'));

    expect(logEventMock).toHaveBeenCalledWith(EventTypes.BUTTON_CLICK, { Content: 'Transaction details', Source: 'Transaction receipt' });
  });

  it('copies the receipt link, turns into a check mark and reports the click', async() => {
    mockTx(() => txMock.base);
    renderReceipt();
    await waitForLoaded();

    fireEvent.click(screen.getByRole('button', { name: 'copy' }));

    expect(writeTextMock).toHaveBeenCalledWith(RECEIPT_URL);
    expect(logEventMock).toHaveBeenCalledWith(EventTypes.BUTTON_CLICK, { Content: 'Copy link', Source: 'Transaction receipt' });
    await waitFor(() => expect(screen.getByRole('button', { name: 'copy' }).querySelector('use')?.getAttribute('href')).toMatch(/#check$/));
  });
});
