import type { ArbitrumL2TxnBatch } from 'types/api/arbitrumL2';

import { finalized } from './txnBatches';

export const batchData: ArbitrumL2TxnBatch = {
  ...finalized,
  after_acc: '0xcd064f3409015e8e6407e492e5275a185e492c6b43ccf127f22092d8057a9ffb',
  before_acc: '0x2ed7c4985eb778d76ec400a43805e7feecc8c2afcdb492dbe5caf227de6d37bc',
  start_block: 1245209,
  end_block: 1245490,
};
