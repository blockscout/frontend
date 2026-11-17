// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { layerLabels } from 'src/features/rollup/common/utils/layer';
import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import StatusTag from 'src/shared/tags/status-tag/StatusTag';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'arbitrum'>;
  isLoading: boolean;
}

const TxDetailsArbitrumL1Txs = ({ data, isLoading }: Props) => {
  const commitmentTx = data.arbitrum?.commitment_transaction;
  const confirmationTx = data.arbitrum?.confirmation_transaction;

  if (!commitmentTx?.hash && !confirmationTx?.hash) {
    return null;
  }

  const isCommitmentFinalized = commitmentTx?.status === 'finalized';

  return (
    <>
      { commitmentTx?.hash && (
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
      { confirmationTx?.hash && (
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
      <DetailedInfo.ItemDivider/>
    </>
  );
};

export default React.memo(TxDetailsArbitrumL1Txs);
