import type { AddressParam } from './addressParams';
import type { DecodedInput } from './decodedInput';

export interface Log {
  address: AddressParam;
  topics: Array<string>;
  data: string;
  index: number;
  decoded: DecodedInput | null;
}

export interface LogsResponse {
  items: Array<Log>;
  next_page_params: {
    index: number;
    items_count: number;
    transaction_hash: string;
  };
}
