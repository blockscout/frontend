import type { AccountHistoryResponse } from 'types/translateApi';

import { TRANSLATE } from './translate';

export const HISTORY: AccountHistoryResponse = {
  hasNextPage: true,
  items: [ TRANSLATE ],
  pageNumber: 1,
  pageSize: 10,
};
