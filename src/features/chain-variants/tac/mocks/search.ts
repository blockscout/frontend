import * as tac from '@blockscout/tac-operation-lifecycle-types';
import type { SearchResultTacOperation } from 'src/features/chain-variants/tac/types/api';

export const tacOperation1: SearchResultTacOperation = {
  type: 'tac_operation',
  tac_operation: {
    operation_id: '0x35f5d9c2bf07477ede48935c7130945faf17a3e5f69a7d20ce3725676513095c',
    type: tac.V2OperationType.TON_TAC_TON,
    status: tac.V2OperationStatus.success,
    rollback: false,
    timestamp: '2025-05-08T07:20:05.000Z',
    sender: {
      address: 'EQBnVg4x6uTCa8jlrh8YXyWpnJJ3oxxrdBQ2+Zw8yaoxnXTt',
      blockchain: tac.V2BlockchainType.TON,
    },
    error_reason: null,
  },
  priority: 0,
};
