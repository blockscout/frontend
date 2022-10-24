export type TTxsFilters = {
  filter: 'pending' | 'validated';
  type?: Array<TypeFilter>;
  method?: Array<MethodFilter>;
}

export type TypeFilter = 'token_transfer' | 'contract_creation' | 'contract_call' | 'coin_transfer' | 'token_creation';

export type MethodFilter = 'approve' | 'transfer' | 'multicall' | 'mint' | 'commit';
