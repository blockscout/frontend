import type { ApiResource } from '../../types';
import type { BlockCountdownResponse } from 'types/api/block';

export const GENERAL_API_V1_RESOURCES = {
  csv_export_txs: {
    path: '/api/v1/transactions-csv',
  },
  csv_export_internal_txs: {
    path: '/api/v1/internal-transactions-csv',
  },
  csv_export_token_transfers: {
    path: '/api/v1/token-transfers-csv',
  },
  csv_export_logs: {
    path: '/api/v1/logs-csv',
  },
  csv_export_epoch_rewards: {
    path: '/api/v1/celo-election-rewards-csv',
  },
  graphql: {
    path: '/api/v1/graphql',
  },
  block_countdown: {
    path: '/api',
  },
} satisfies Record<string, ApiResource>;

export type GeneralApiV1ResourceName = `general:${ keyof typeof GENERAL_API_V1_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type GeneralApiV1ResourcePayload<R extends GeneralApiV1ResourceName> =
R extends 'general:block_countdown' ? BlockCountdownResponse :
never;
/* eslint-enable @stylistic/indent */
