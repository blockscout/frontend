// SPDX-License-Identifier: LicenseRef-Blockscout

import type { SearchResultType } from '../types/client';

export const SEARCH_RESULT_TYPES: Array<SearchResultType> = [
  'token',
  'address',
  'block',
  'transaction',
  'contract',
  'ens_domain',
  'cluster',
  'label',
  'user_operation',
  'blob',
  'metadata_tag',
  'tac_operation',
];
