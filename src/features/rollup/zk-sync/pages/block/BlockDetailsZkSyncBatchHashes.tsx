// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ZkSyncL2TxnBatchHashesInfo from 'src/features/rollup/zk-sync/pages/batch-details/ZkSyncL2TxnBatchHashesInfo';

import config from 'src/config';

const rollupFeature = config.features.rollup;
const isZkSync = rollupFeature.isEnabled && rollupFeature.type === 'zkSync';

interface Props {
  data: Pick<schemas['BlockResponse'], 'zksync'>;
  isLoading: boolean;
}

const BlockDetailsZkSyncBatchHashes = ({ data, isLoading }: Props) => {
  if (!isZkSync || !data.zksync) {
    return null;
  }

  return <ZkSyncL2TxnBatchHashesInfo data={ data.zksync } isLoading={ isLoading }/>;
};

export default React.memo(BlockDetailsZkSyncBatchHashes);
