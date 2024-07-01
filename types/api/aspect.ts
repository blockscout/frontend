import type { Fee } from './fee';

export interface AspectVersion {
  aspect_transaction_hash: string;
  aspect_transaction_index: number;
  block_number: number;
  join_points: Array<string>;
  properties: Record<string, string>;
  version: number;
}

export interface AspectDetail {
  bound_address_count: number;
  deployed_tx: string;
  hash: string;
  join_points: Array<string>;
  properties: Record<string, string>;
  versions: Array<AspectVersion>;
}

export interface AspectBinding {
  bind_aspect_transaction_hash: string;
  bind_aspect_transaction_index: number;
  bind_block_number: number;
  bound_address_hash: string;
  contract_code: number;
  is_smart_contract: boolean;
  priority: number;
  version: number;
}

export interface AspectBindingResponse {
  items: Array<AspectBinding>;
  next_page_params: AspectBindingPagination | null;
}

export type AspectBindingPagination = {
  block_number: number;
  index: number;
  items_count: number;
}

export interface AspectTxs {
  block_hash: string;
  block_number: number;
  error: string | null;
  fee: Fee;
  from_address_hash: string;
  gas_price: string;
  gas_used: string;
  hash: string;
  index: number;
  result: string;
  status: 'ok' | 'error' | null;
  to_address_hash: string;
  type: string;
  value: string;
}

export interface AspectTxsResponse {
  items: Array<AspectTxs>;
  next_page_params: AspectTxsPagination | null;
}

export type AspectTxsPagination = {
  block_number: number;
  index: number;
  items_count: number;
}
