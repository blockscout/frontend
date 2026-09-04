// SPDX-License-Identifier: LicenseRef-Blockscout

export interface ApiResource {
  path: string;
  pathParams?: Array<string>;
  filterFields?: Array<string>;
  scopeFilters?: Array<string>;
  paginated?: boolean;
  headers?: RequestInit['headers'];
}

export type IsPaginated<R extends ApiResource> = R extends { paginated: true } ? true : false;
