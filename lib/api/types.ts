export type ApiName =
'general' | 'admin' | 'bens' | 'contractInfo' | 'clusters' | 'external' |
'metadata' | 'multichainAggregator' | 'multichainStats' | 'rewards' | 'stats' | 'tac' |
'userOps' | 'visualize' | 'zetachain';

export interface ApiResource {
  path: string;
  pathParams?: Array<string>;
  filterFields?: Array<string>;
  paginated?: boolean;
  headers?: RequestInit['headers'];
}
