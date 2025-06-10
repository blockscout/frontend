import type { Erc20TotalPayload } from './tokenTransfer';

export type CeloEpochListItem = {
  number: number;
  start_block_number: number;
  end_block_number: number;
  timestamp: string;
  distribution: {
    carbon_offsetting_transfer: Erc20TotalPayload | null;
    community_transfer: Erc20TotalPayload | null;
    transfers_total: Erc20TotalPayload | null;
  } | null;
};

export type CeloEpochListResponse = {
  items: Array<CeloEpochListItem>;
  next_page_params: {
    items_count: number;
    number: number;
  } | null;
};

export type CeloEpochDetails = {
  number: number;
  start_block_number: number;
  end_block_number: number;
};
