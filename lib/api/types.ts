export type ApiName = 'general' | 'admin' | 'bens' | 'contractInfo' | 'metadata' | 'rewards' | 'stats' | 'visualize';

export interface ApiResource {
  path: string;
  pathParams?: Array<string>;
  filterFields?: Array<string>;
  paginated?: boolean;
  headers?: RequestInit['headers'];
}
