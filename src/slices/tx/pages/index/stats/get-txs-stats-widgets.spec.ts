// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as stats from '@blockscout/stats-types';

import { thinsp } from 'src/toolkit/utils/htmlEntities';

import { describe, it, expect } from 'vitest';

import type { TxsStatsWidgetsParams } from './get-txs-stats-widgets';
import { getTxsStatsWidgets } from './get-txs-stats-widgets';

const counter = (value: string, title = ''): stats.Counter => ({ id: 'counter', value, title, description: '', units: '' });

const MICROSERVICE_STATS: stats.TransactionsPageStats = {
  transactions_24h: counter('1197340', 'New transactions (24h)'),
  operational_transactions_24h: counter('1100000', 'Arbitrum op transactions'),
  op_stack_operational_transactions_24h: counter('1050000', 'OP Stack op transactions'),
  pending_transactions_30m: counter('1245', 'Queued transactions (30m)'),
  transactions_fee_24h: counter('6734.1', 'Fees paid'),
  average_transactions_fee_24h: counter('0.0056', 'Average fee'),
};

const API_STATS: NonNullable<TxsStatsWidgetsParams['apiStats']> = {
  pending_transactions_count: '4200',
  transaction_fees_avg_24h: '22342870314428',
  transaction_fees_sum_24h: '22184012506492688277',
  transactions_count_24h: '992890',
};

const ETH = { symbol: 'ETH', decimals: 18 };

const MICROSERVICE_PARAMS: TxsStatsWidgetsParams = {
  isStatsFeatureEnabled: true,
  rollupType: undefined,
  currency: ETH,
  chainId: undefined,
  microserviceStats: MICROSERVICE_STATS,
  apiStats: undefined,
  coinPrice: '2000',
};

const API_PARAMS: TxsStatsWidgetsParams = {
  isStatsFeatureEnabled: false,
  rollupType: undefined,
  currency: ETH,
  chainId: undefined,
  microserviceStats: undefined,
  apiStats: API_STATS,
  coinPrice: '2000',
};

describe('getTxsStatsWidgets', () => {
  describe('with the stats microservice', () => {
    it('builds the widgets from the microservice counters, labelled by their titles and linked to the stats pages', () => {
      expect(getTxsStatsWidgets(MICROSERVICE_PARAMS)).toEqual([
        {
          id: 'newTxns',
          label: 'New transactions',
          value: '1,197,340',
          period: '24h',
          href: { pathname: '/stats/[id]', query: { id: 'newTxns' } },
        },
        {
          id: 'pendingTxns',
          label: 'Queued transactions',
          value: '1,245',
          period: '30min',
        },
        {
          id: 'txnsFee',
          label: 'Fees paid',
          value: '6,734.1',
          valuePostfix: `${ thinsp }ETH`,
          period: '24h',
          href: { pathname: '/stats/[id]', query: { id: 'txnsFee' } },
        },
        {
          id: 'averageTxnFee',
          label: 'Average fee',
          value: '11.2',
          valuePrefix: '$',
          period: '24h',
          href: { pathname: '/stats/[id]', query: { id: 'averageTxnFee' } },
        },
      ]);
    });

    it('adds the chain id to the stats page links of a multichain chain', () => {
      const links = getTxsStatsWidgets({ ...MICROSERVICE_PARAMS, chainId: '42' }).map(({ href }) => href);

      expect(links).toEqual([
        { pathname: '/stats/[id]', query: { id: 'newTxns', chain_id: '42' } },
        undefined,
        { pathname: '/stats/[id]', query: { id: 'txnsFee', chain_id: '42' } },
        { pathname: '/stats/[id]', query: { id: 'averageTxnFee', chain_id: '42' } },
      ]);
    });

    it('falls back to the default labels when the counters have no titles', () => {
      const untitled: stats.TransactionsPageStats = {
        transactions_24h: counter('1'),
        operational_transactions_24h: counter('1'),
        pending_transactions_30m: counter('1'),
        transactions_fee_24h: counter('1'),
        average_transactions_fee_24h: counter('1'),
      };

      const labels = getTxsStatsWidgets({ ...MICROSERVICE_PARAMS, rollupType: 'arbitrum', microserviceStats: untitled }).map(({ label }) => label);

      expect(labels).toEqual([ 'Transactions', 'Daily op txns', 'Pending transactions', 'Transactions fees', 'Avg. transaction fee' ]);
    });

    it.each([
      [ 'arbitrum' as const, 'Arbitrum op transactions', '1,100,000' ],
      [ 'optimistic' as const, 'OP Stack op transactions', '1,050,000' ],
    ])('shows the daily operational transactions of an %s rollup after the transactions count', (rollupType, label, value) => {
      const widgets = getTxsStatsWidgets({ ...MICROSERVICE_PARAMS, rollupType });

      expect(widgets[1]).toEqual({ id: 'operationalTxns', label, value, period: '24h' });
    });

    it('shows no operational transactions on other rollups', () => {
      const ids = getTxsStatsWidgets({ ...MICROSERVICE_PARAMS, rollupType: 'zkSync' }).map(({ id }) => id);

      expect(ids).toEqual([ 'newTxns', 'pendingTxns', 'txnsFee', 'averageTxnFee' ]);
    });

    it('shows the average fee in the native coin when there is no coin price', () => {
      const avgFee = getTxsStatsWidgets({ ...MICROSERVICE_PARAMS, coinPrice: null }).at(-1);

      expect(avgFee).toEqual({
        id: 'averageTxnFee',
        label: 'Average fee',
        value: '0.0056',
        valuePostfix: `${ thinsp }ETH`,
        period: '24h',
        href: { pathname: '/stats/[id]', query: { id: 'averageTxnFee' } },
      });
    });

    it('omits the widgets whose counters are missing', () => {
      expect(getTxsStatsWidgets({ ...MICROSERVICE_PARAMS, rollupType: 'optimistic', microserviceStats: {} })).toEqual([]);
    });
  });

  describe('with the core API', () => {
    it('builds the widgets from the API stats, converts the fees from wei and links nowhere', () => {
      expect(getTxsStatsWidgets(API_PARAMS)).toEqual([
        {
          id: 'newTxns',
          label: 'Transactions',
          value: '992,890',
          period: '24h',
        },
        {
          id: 'pendingTxns',
          label: 'Pending transactions',
          value: '4,200',
          period: '1h',
        },
        {
          id: 'txnsFee',
          label: 'Transactions fees',
          value: '22.18',
          valuePostfix: `${ thinsp }ETH`,
          period: '24h',
        },
        {
          id: 'averageTxnFee',
          label: 'Avg. transaction fee',
          value: '0.04',
          valuePrefix: '$',
          period: '24h',
        },
      ]);
    });

    it('converts the average fee from wei when there is no coin price', () => {
      expect(getTxsStatsWidgets({ ...API_PARAMS, coinPrice: undefined }).at(-1)).toMatchObject({
        value: '0.00002234',
        valuePostfix: `${ thinsp }ETH`,
      });
    });

    it('ignores the microservice counters', () => {
      const widgets = getTxsStatsWidgets({ ...API_PARAMS, rollupType: 'arbitrum', microserviceStats: MICROSERVICE_STATS });

      expect(widgets.map(({ id, value }) => [ id, value ])).toEqual([
        [ 'newTxns', '992,890' ],
        [ 'pendingTxns', '4,200' ],
        [ 'txnsFee', '22.18' ],
        [ 'averageTxnFee', '0.04' ],
      ]);
    });

    it('omits the widgets whose values are missing', () => {
      const emptyStats = { ...API_STATS, pending_transactions_count: '', transaction_fees_avg_24h: '', transactions_count_24h: '' };

      expect(getTxsStatsWidgets({ ...API_PARAMS, apiStats: emptyStats }).map(({ id }) => id)).toEqual([ 'txnsFee' ]);
    });
  });
});
