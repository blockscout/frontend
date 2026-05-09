import type { Abi } from 'abitype';

import type { MudWorldSchema, MudWorldTable } from 'types/api/mudWorlds';

export type AddressMudTableItem = {
  schema: MudWorldSchema;
  table: MudWorldTable;
};

export type AddressMudTables = {
  items: Array<AddressMudTableItem>;
  next_page_params: {
    items_count: number;
    table_id: string;
  };
};

export type AddressMudTablesFilter = {
  q?: string;
};

export type AddressMudRecords = {
  items: Array<AddressMudRecordsItem>;
  schema: MudWorldSchema;
  table: MudWorldTable;
  next_page_params: {
    items_count: number;
    key0: string;
    key1: string;
    key_bytes: string;
  };
};

export type AddressMudRecordsItem = {
  decoded: Record<string, string | Array<string>>;
  id: string;
  is_deleted: boolean;
  timestamp: string;
};

export type AddressMudRecordsFilter = {
  filter_key0?: string;
  filter_key1?: string;
};

export type AddressMudRecordsSorting = {
  sort: 'key0' | 'key1';
  order: 'asc' | 'desc' | undefined;
};

export type AddressMudRecord = {
  record: AddressMudRecordsItem;
  schema: MudWorldSchema;
  table: MudWorldTable;
};

export interface SmartContractMudSystemsResponse {
  items: Array<SmartContractMudSystemItem>;
}

export interface SmartContractMudSystemItem {
  address_hash: string;
  name: string;
}

export interface SmartContractMudSystemInfo {
  name: string;
  abi: Abi;
}
