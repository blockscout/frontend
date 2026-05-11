import type { CsvExportItemStatus } from './api';

export type CsvExportType =
    'address_txs' |
    'address_internal_txs' |
    'address_token_transfers' |
    'address_logs' |
    'token_holders' |
    'address_epoch_rewards' |
    'advanced_filters';

export type CsvExportDownloadStatus = CsvExportItemStatus | 'expired';
