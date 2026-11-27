// @vitest-environment jsdom

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { TxInterpretationResponse } from 'src/features/tx-interpretation/common/types/api';

import { SocketProvider } from 'src/api/socket/context';

import * as txMock from 'src/slices/tx/mocks/details';

import { MultichainContext } from 'src/features/multichain/context';
import { chainA } from 'src/features/multichain/mocks/chains';
import * as interpretationMock from 'src/features/tx-interpretation/blockscout/mocks';

import { EventTypes } from 'src/shared/analytics';
import * as analyticsQueue from 'src/shared/analytics/queue';

import { SECOND } from 'src/toolkit/utils/consts';
import { nbsp } from 'src/toolkit/utils/htmlEntities';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act, waitFor, fireEvent, within } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';
import { apiRequests, mockApiAndRpc, rpcRequests } from 'vitest/utils/mockJsonRpc';
import { MOCK_SOCKET_URL, sendSocketMessage } from 'vitest/utils/mockSocket';
import { mockLocalUtcOffset } from 'vitest/utils/mockTimeZone';
import { routerStandIn, RouterStandInProvider } from 'vitest/utils/routerStandIn';

vi.mock('phoenix', () => import('vitest/utils/mockSocket').then((m) => m.phoenixModule));

import TxReceipt from './TxReceipt';

const HASH = txMock.base.hash;
const TX_URL_PART = `/transactions/${ HASH }`;
const INTERPRETATION_URL_PART = `/transactions/${ HASH }/summary`;
const RECEIPT_URL = `http://localhost:3000/tx/${ HASH }/receipt`;

// the backend waits for the block before the transaction is re-read, and the hook mirrors that delay
const STATUS_UPDATE_DELAY = 5 * SECOND;

const writeTextMock = vi.fn();

beforeEach(() => {
  fetchMock.resetMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  mockLocalUtcOffset(0);
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: writeTextMock.mockResolvedValue(undefined) }, configurable: true });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
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
    expect(getRowValue('Tx fee')).toMatch(/^0\.00714317\s*ETH\s*\(<\s*\$0\.01\)$/);
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

describe('transaction receipt summary from an interpretation', () => {
  type InterpretationResponse = { body: TxInterpretationResponse } | { status: number } | { pending: Promise<TxInterpretationResponse> };

  function deferInterpretation() {
    let resolve: (body: TxInterpretationResponse) => void = () => {};
    const pending = new Promise<TxInterpretationResponse>((fulfil) => {
      resolve = fulfil;
    });
    return { pending, resolve };
  }

  function respondWithInterpretation(interpretation: InterpretationResponse) {
    if ('pending' in interpretation) {
      return interpretation.pending.then((body) => ({ body: JSON.stringify(body) }));
    }
    return 'body' in interpretation ? { body: JSON.stringify(interpretation.body) } : { status: interpretation.status, body: '{}' };
  }

  function mockTxAndInterpretation(getTx: () => schemas['TransactionResponse'], interpretation: InterpretationResponse) {
    mockApiAndRpc({
      api: (url) => {
        if (url.includes(INTERPRETATION_URL_PART)) {
          return respondWithInterpretation(interpretation);
        }
        return url.includes(TX_URL_PART) ? { body: JSON.stringify(getTx()) } : { status: 404, body: '{}' };
      },
    });
  }

  // the config is re-read per provider, so the tree and everything that reads the router come in after the envs
  async function mountReceiptWithEnvs() {
    const { render: renderWithEnvs } = await import('vitest/lib');
    const { routerStandIn: router, RouterStandInProvider: RouterProvider } = await import('vitest/utils/routerStandIn');
    const { SocketProvider: Socket } = await import('src/api/socket/context');
    const { 'default': Receipt } = await import('./TxReceipt');

    router.reset({ pathname: '/tx/[hash]/receipt', query: { hash: HASH } });
    renderWithEnvs(
      <RouterProvider>
        <Socket url={ MOCK_SOCKET_URL }>
          <Receipt/>
        </Socket>
      </RouterProvider>,
    );
  }

  async function renderReceiptWithEnvs() {
    await mountReceiptWithEnvs();
    await waitForLoaded();
  }

  const withProvider = (provider: string, run: () => Promise<void>) => {
    return withEnvs([ [ 'NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER', provider ] ], run);
  };

  function getSummary() {
    return within(screen.getByRole('region', { name: 'Transaction summary' }));
  }

  function interpretationRequests() {
    return apiRequests().filter((url) => url.includes('/summary') || url.includes('/noves'));
  }

  it('shows the interpretation sentence with its action type on a line of its own, linking nothing', async() => {
    await withProvider('blockscout', async() => {
      mockTxAndInterpretation(() => txMock.base, { body: interpretationMock.swapOnMarket });
      await renderReceiptWithEnvs();

      const summary = getSummary();
      await waitFor(() => expect(summary.getByRole('heading').textContent).toBe('Swap'));
      expect(summary.getByText(/for/).textContent).toMatch(/^813\.62\s?ARIA for 0\.036\s?USDC on Uniswap V3 by ArianeeStore$/);
      expect(screen.getByRole('region', { name: 'Transaction summary' }).querySelector('a')).toBeNull();
    });
  });

  it('shows a sentence without an action type as one sentence, with no heading', async() => {
    await withProvider('blockscout', async() => {
      mockTxAndInterpretation(() => txMock.base, { body: interpretationMock.withdrawWithoutActionType });
      await renderReceiptWithEnvs();

      await waitFor(() => expect(getSummary().getByText(/Initiated Withdraw of/)).toBeTruthy());
      expect(getSummary().queryByRole('heading')).toBeNull();
    });
  });

  it('shows the transfer view for a token transfer, the recipient only in the parties row', async() => {
    await withProvider('blockscout', async() => {
      mockTxAndInterpretation(() => txMock.base, { body: interpretationMock.txInterpretation });
      await renderReceiptWithEnvs();

      const summary = getSummary();
      await waitFor(() => expect(summary.getByText('DUCK')).toBeTruthy());
      expect(summary.getByRole('heading').textContent).toBe('Transfer');
      expect(summary.getByText('100')).toBeTruthy();
      expect(summary.getByText('to')).toBeTruthy();
    });
  });

  it.each([
    [ 'an empty summaries list', { body: { data: { summaries: [] } } } ],
    [ 'a failed request', { status: 500 } ],
  ])('falls back on %s', async(_, interpretation: InterpretationResponse) => {
    await withProvider('blockscout', async() => {
      mockTxAndInterpretation(() => txMock.withRawRevertReason, interpretation);
      await renderReceiptWithEnvs();
      await act(() => vi.advanceTimersByTimeAsync(10 * SECOND));

      await waitFor(() => expect(getSummary().getByRole('heading').textContent).toBe('Call'));
      expect(interpretationRequests()).not.toEqual([]);
    });
  });

  it.each([ 'noves', 'none' ])('asks for no interpretation with the %s provider', async(provider) => {
    await withProvider(provider, async() => {
      mockTxAndInterpretation(() => txMock.base, { body: interpretationMock.swapOnMarket });
      await renderReceiptWithEnvs();

      expect(getSummary().getByRole('heading').textContent).toBe('Transfer');
      expect(interpretationRequests()).toEqual([]);
    });
  });

  it('keeps the whole card in its first placeholder until the interpretation arrives', async() => {
    await withProvider('blockscout', async() => {
      const interpretation = deferInterpretation();
      mockTxAndInterpretation(() => txMock.base, interpretation);
      await mountReceiptWithEnvs();

      await waitFor(() => expect(interpretationRequests()).not.toEqual([]));
      expect(document.querySelector('dd[data-loading]')).not.toBeNull();

      interpretation.resolve(interpretationMock.swapOnMarket);
      await waitForLoaded();
      expect(getSummary().getByRole('heading').textContent).toBe('Swap');
      expect(getRowValue('Date')).toBe('Oct 10 2022');
    });
  });

  it('asks for the interpretation of a pending transaction once it settles, keeping the card on screen meanwhile', async() => {
    await withProvider('blockscout', async() => {
      let tx = txMock.pending;
      const interpretation = deferInterpretation();
      mockTxAndInterpretation(() => tx, interpretation);
      await renderReceiptWithEnvs();

      expect(getSummary().getByRole('heading').textContent).toBe('Transfer');
      expect(interpretationRequests()).toEqual([]);

      tx = txMock.base;
      await waitFor(() => sendSocketMessage(`transactions:${ HASH }`, 'collated', {}));
      await act(() => vi.advanceTimersByTimeAsync(STATUS_UPDATE_DELAY));

      await waitFor(() => expect(interpretationRequests()).not.toEqual([]));
      expect(document.querySelector('dd[data-loading]')).toBeNull();
      expect(getRowValue('Date')).toBe('Oct 10 2022');
      expect(getSummary().getByRole('heading').textContent).toBe('Transfer');

      interpretation.resolve(interpretationMock.swapOnMarket);
      await waitFor(() => expect(getSummary().getByRole('heading').textContent).toBe('Swap'));
    });
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

    const track = vi.spyOn(analyticsQueue, 'track');
    fireEvent.click(screen.getByText('Transaction details'));

    expect(track).toHaveBeenCalledWith(EventTypes.BUTTON_CLICK, { Content: 'Transaction details', Source: 'Transaction receipt' }, undefined);
  });

  it('copies the receipt link, turns into a check mark and reports the click', async() => {
    mockTx(() => txMock.base);
    renderReceipt();
    await waitForLoaded();

    const track = vi.spyOn(analyticsQueue, 'track');
    fireEvent.click(screen.getByRole('button', { name: 'copy' }));

    expect(writeTextMock).toHaveBeenCalledWith(RECEIPT_URL);
    expect(track).toHaveBeenCalledWith(EventTypes.BUTTON_CLICK, { Content: 'Copy link', Source: 'Transaction receipt' }, undefined);
    await waitFor(() => expect(screen.getByRole('button', { name: 'copy' }).querySelector('use')?.getAttribute('href')).toMatch(/#check$/));
  });
});

describe('transaction receipt in multichain mode', () => {
  const ROUTED_CHAIN_LOGO = '/assets/configs/network_logo.svg';

  function buildRoutedChain(logo: ClusterChainConfig['app_config']['chain']['logo'], decimals = 18): ClusterChainConfig {
    return {
      ...chainA,
      app_config: {
        ...chainA.app_config,
        chain: {
          ...chainA.app_config.chain,
          name: 'Routed chain',
          logo,
          currency: { ...chainA.app_config.chain.currency, symbol: 'xDAI', weiName: 'grain', decimals },
        },
      },
    };
  }

  function renderMultichainReceipt(chain = buildRoutedChain({ 'default': ROUTED_CHAIN_LOGO, dark: undefined })) {
    routerStandIn.reset({ pathname: '/chain/[chain_slug_or_id]/tx/[hash]/receipt', query: { chain_slug_or_id: chain.slug, hash: HASH } });
    return render(
      <RouterStandInProvider>
        <MultichainContext.Provider value={{ chain }}>
          <SocketProvider url={ MOCK_SOCKET_URL }>
            <TxReceipt/>
          </SocketProvider>
        </MultichainContext.Provider>
      </RouterStandInProvider>,
    );
  }

  it('shows the routed chain\'s logo from its own explorer, its name and native coin', async() => {
    mockTx(() => txMock.base);
    renderMultichainReceipt();
    await waitForLoaded();

    expect(screen.getByAltText('Routed chain network logo').getAttribute('src')).toBe(`https://op-mainnet.com${ ROUTED_CHAIN_LOGO }`);
    expect(getRowValue('Chain')).toBe('Routed chain');
    expect(within(screen.getByRole('region', { name: 'Transaction summary' })).getByText('xDAI')).toBeTruthy();
  });

  it('shows the fee in the routed chain\'s native coin', async() => {
    mockTx(() => txMock.base);
    renderMultichainReceipt();
    await waitForLoaded();

    expect(getRowValue('Tx fee')).toMatch(/^0\.00714317\s*xDAI/);
  });

  it('scales the fee by the decimals of the routed chain\'s native coin', async() => {
    mockTx(() => txMock.base);
    renderMultichainReceipt(buildRoutedChain({ 'default': ROUTED_CHAIN_LOGO, dark: undefined }, 12));
    await waitForLoaded();

    expect(getRowValue('Tx fee')).toMatch(/^7,143\.168\s*xDAI/);
  });

  it('names the routed chain\'s native coin and its smallest unit in an interpretation sentence', async() => {
    const chain = buildRoutedChain({ 'default': ROUTED_CHAIN_LOGO, dark: undefined });
    const summary = {
      summary_template: '{action_type} {amount} {native} for {gas} {wei}',
      summary_template_variables: {
        action_type: { type: 'string' as const, value: 'Wrap' },
        amount: { type: 'currency' as const, value: '5' },
        gas: { type: 'currency' as const, value: '21000' },
      },
    };
    mockApiAndRpc({
      api: (url) => url.includes(INTERPRETATION_URL_PART) ?
        { body: JSON.stringify({ data: { summaries: [ summary ] } }) } :
        { body: JSON.stringify(txMock.base) },
    });
    const txInterpretation = { title: 'Transaction interpretation', isEnabled: true, provider: 'blockscout' as const };
    const features = { ...chain.app_config.features, txInterpretation };
    renderMultichainReceipt({ ...chain, app_config: { ...chain.app_config, features } });
    await waitForLoaded();

    const sentence = within(screen.getByRole('region', { name: 'Transaction summary' }));
    await waitFor(() => expect(sentence.getByText('xDAI')).toBeTruthy());
    expect(sentence.getByText('grain')).toBeTruthy();
  });

  it('shows the logo placeholder when the routed chain has no logo', async() => {
    mockTx(() => txMock.base);
    renderMultichainReceipt(buildRoutedChain({ 'default': undefined, dark: undefined }));
    await waitForLoaded();

    expect(screen.getByLabelText('Network logo placeholder')).toBeTruthy();
  });

  it('asks the routed chain\'s API for the transaction', async() => {
    mockTx(() => txMock.base);
    renderMultichainReceipt();
    await waitForLoaded();

    expect(apiRequests()).toContain(`${ chainA.app_config.apis.core?.endpoint }/api/v2/transactions/${ HASH }`);
  });

  it('turns a pending transaction into its final status when the block is collated', async() => {
    let tx = txMock.pending;
    mockTx(() => tx);
    renderMultichainReceipt();
    await waitForLoaded();

    tx = txMock.base;
    await waitFor(() => sendSocketMessage(`transactions:${ HASH }`, 'collated', {}));
    await act(() => vi.advanceTimersByTimeAsync(STATUS_UPDATE_DELAY));

    expect(await screen.findByText('Success')).toBeTruthy();
    expect(getRowValue('Date')).toBe('Oct 10 2022');
  });

  it('links the transaction details and copies the receipt link on the same chain', async() => {
    mockTx(() => txMock.base);
    const { container } = renderMultichainReceipt();
    await waitForLoaded();

    expect(container.querySelector('a')?.getAttribute('href')).toBe(`/chain/${ chainA.slug }/tx/${ HASH }`);

    fireEvent.click(screen.getByRole('button', { name: 'copy' }));
    expect(writeTextMock).toHaveBeenCalledWith(`http://localhost:3000/chain/${ chainA.slug }/tx/${ HASH }/receipt`);
  });

  it('redirects to the transaction page of the same chain on a failed request', async() => {
    mockApiAndRpc({ api: () => ({ status: 404, body: '{}' }) });
    renderMultichainReceipt();

    await act(() => vi.advanceTimersByTimeAsync(10 * SECOND));

    await waitFor(() => expect(routerStandIn.pathname).toBe('/chain/[chain_slug_or_id]/tx/[hash]'));
    expect(routerStandIn.query).toEqual({ chain_slug_or_id: chainA.slug, hash: HASH });
  });
});
