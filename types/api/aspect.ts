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
