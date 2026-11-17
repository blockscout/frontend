// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { layerLabels } from 'src/features/rollup/common/utils/layer';
import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import StatusTag from 'src/shared/tags/status-tag/StatusTag';

const rollupFeature = config.features.rollup;
const isArbitrum = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';

interface Props {
  data: Pick<schemas['BlockResponse'], 'arbitrum'>;
  isLoading: boolean;
}

const BlockDetailsArbitrumL1Txs = ({ data, isLoading }: Props) => {
  if (!isArbitrum || !data.arbitrum) {
    return null;
  }

  const { commitment_transaction: commitmentTx, confirmation_transaction: confirmationTx } = data.arbitrum;

  if (!commitmentTx.hash && !confirmationTx.hash) {
    return null;
  }

  const isCommitmentFinalized = commitmentTx.status === 'finalized';

  return (
    <>
      <DetailedInfo.ItemDivider/>
      { commitmentTx.hash && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `${ layerLabels.parent } transaction containing this batch commitment` }
            isLoading={ isLoading }
          >
            Commitment tx
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <TxEntity hash={ commitmentTx.hash } isLoading={ isLoading } chain={ parentChain }/>
            { isCommitmentFinalized && <StatusTag type="ok" text="Finalized" ml={ 2 }/> }
          </DetailedInfo.ItemValue>
        </>
      ) }
      { confirmationTx.hash && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `${ layerLabels.parent } transaction containing confirmation of this batch` }
            isLoading={ isLoading }
          >
            Confirmation tx
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <TxEntity hash={ confirmationTx.hash } isLoading={ isLoading } chain={ parentChain }/>
            { isCommitmentFinalized && <StatusTag type="ok" text="Finalized" ml={ 2 }/> }
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(BlockDetailsArbitrumL1Txs);
