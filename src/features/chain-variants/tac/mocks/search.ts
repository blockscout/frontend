import type { SearchResultTacOperation } from 'src/features/chain-variants/tac/types/api';

import * as tacOperationMock from './operations';

export const tacOperation1: SearchResultTacOperation = {
  type: 'tac_operation',
  tac_operation: tacOperationMock.tacOperation,
  priority: 0,
};
