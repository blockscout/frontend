// SPDX-License-Identifier: LicenseRef-Blockscout

import { isNotNil } from 'es-toolkit';

import type { operations } from '@blockscout/api-types';
import type * as stats from '@blockscout/stats-types';
import type { RollupType } from 'src/features/rollup/common/types/config';

import type { Route } from 'src/shared/router/routes';
import getStatsLabelFromTitle from 'src/shared/stats/get-stats-label-from-title';
import calculateUsdValue from 'src/shared/values/entity/calculateUsdValue';

import { thinsp } from 'src/toolkit/utils/htmlEntities';

export interface TxsStatsWidget {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly valuePrefix?: string;
  readonly valuePostfix?: string;
  readonly period: '24h' | '30min' | '1h';
  readonly href?: Route;
}

export interface TxsStatsWidgetsParams {
  readonly isStatsFeatureEnabled: boolean;
  readonly rollupType: RollupType | undefined;
  readonly currency: { readonly symbol: string | undefined; readonly decimals: number };
  readonly chainId: string | undefined;
  readonly microserviceStats: stats.TransactionsPageStats | undefined;
  readonly apiStats: operations['TransactionController.stats']['json'] | undefined;
  readonly coinPrice: string | null | undefined;
}

const getLabel = (counter: stats.Counter | undefined, fallback: string): string => {
  return counter?.title ? getStatsLabelFromTitle(counter.title) : fallback;
};

const getStatsPageHref = (params: TxsStatsWidgetsParams, id: string): Route | undefined => {
  if (!params.isStatsFeatureEnabled) {
    return undefined;
  }

  return { pathname: '/stats/[id]', query: { id, ...(params.chainId ? { chain_id: params.chainId } : {}) } };
};

const getTxCountWidget = (params: TxsStatsWidgetsParams): TxsStatsWidget | undefined => {
  const counter = params.microserviceStats?.transactions_24h;
  const value = params.isStatsFeatureEnabled ? counter?.value : params.apiStats?.transactions_count_24h;

  if (!value) {
    return undefined;
  }

  return {
    id: 'newTxns',
    label: getLabel(counter, 'Transactions'),
    value: Number(value).toLocaleString(),
    period: '24h',
    href: getStatsPageHref(params, 'newTxns'),
  };
};

const getOperationalTxnsCounter = (params: TxsStatsWidgetsParams): stats.Counter | undefined => {
  if (!params.isStatsFeatureEnabled) {
    return undefined;
  }

  switch (params.rollupType) {
    case 'arbitrum':
      return params.microserviceStats?.operational_transactions_24h;
    case 'optimistic':
      return params.microserviceStats?.op_stack_operational_transactions_24h;
  }
};

const getOperationalTxnsWidget = (params: TxsStatsWidgetsParams): TxsStatsWidget | undefined => {
  const counter = getOperationalTxnsCounter(params);

  if (!counter?.value) {
    return undefined;
  }

  return {
    id: 'operationalTxns',
    label: getLabel(counter, 'Daily op txns'),
    value: Number(counter.value).toLocaleString(),
    period: '24h',
  };
};

const getPendingTxnsWidget = (params: TxsStatsWidgetsParams): TxsStatsWidget | undefined => {
  const counter = params.microserviceStats?.pending_transactions_30m;
  const value = params.isStatsFeatureEnabled ? counter?.value : params.apiStats?.pending_transactions_count;

  if (!value) {
    return undefined;
  }

  return {
    id: 'pendingTxns',
    label: getLabel(counter, 'Pending transactions'),
    value: Number(value).toLocaleString(),
    period: params.isStatsFeatureEnabled ? '30min' : '1h',
  };
};

const getTxFeeSumWidget = (params: TxsStatsWidgetsParams): TxsStatsWidget | undefined => {
  const counter = params.microserviceStats?.transactions_fee_24h;
  // in microservice data, fee values are already divided by 10^decimals
  const value = params.isStatsFeatureEnabled ?
    Number(counter?.value) :
    Number(params.apiStats?.transaction_fees_sum_24h) / (10 ** params.currency.decimals);

  if (Number.isNaN(value)) {
    return undefined;
  }

  return {
    id: 'txnsFee',
    label: getLabel(counter, 'Transactions fees'),
    value: value.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    valuePostfix: thinsp + params.currency.symbol,
    period: '24h',
    href: getStatsPageHref(params, 'txnsFee'),
  };
};

const getAvgTxFeeWidget = (params: TxsStatsWidgetsParams): TxsStatsWidget | undefined => {
  const counter = params.microserviceStats?.average_transactions_fee_24h;
  const amount = params.isStatsFeatureEnabled ? counter?.value : params.apiStats?.transaction_fees_avg_24h;

  if (!amount) {
    return undefined;
  }

  const { usdStr, valueStr } = calculateUsdValue({
    amount,
    exchangeRate: params.coinPrice,
    // in microservice data, fee values are already divided by 10^decimals
    decimals: params.isStatsFeatureEnabled ? '0' : String(params.currency.decimals),
  });

  return {
    id: 'averageTxnFee',
    label: getLabel(counter, 'Avg. transaction fee'),
    ...(usdStr ? { value: usdStr, valuePrefix: '$' } : { value: valueStr, valuePostfix: thinsp + params.currency.symbol }),
    period: '24h',
    href: getStatsPageHref(params, 'averageTxnFee'),
  };
};

export function getTxsStatsWidgets(params: TxsStatsWidgetsParams): Array<TxsStatsWidget> {
  return [
    getTxCountWidget(params),
    getOperationalTxnsWidget(params),
    getPendingTxnsWidget(params),
    getTxFeeSumWidget(params),
    getAvgTxFeeWidget(params),
  ].filter(isNotNil);
}
