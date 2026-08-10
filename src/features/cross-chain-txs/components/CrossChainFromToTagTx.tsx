// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import CrossChainFromToTag from './CrossChainFromToTag';

interface Props {
  data: InterchainMessage;
  isLoading?: boolean;
  currentAddress: string;
}

const CrossChainFromToTagTx = ({ data, isLoading, currentAddress }: Props) => {
  const transfersNum = data.transfers.length;

  if (transfersNum === 1) {
    const { sender, recipient } = data.transfers[0];
    if (sender?.hash.toLowerCase() === currentAddress.toLowerCase() || recipient?.hash.toLowerCase() === currentAddress.toLowerCase()) {
      return (
        <CrossChainFromToTag
          currentAddress={ currentAddress }
          sender={ sender?.hash }
          recipient={ recipient?.hash }
          isLoading={ isLoading }
        />
      );
    }
  }

  return (
    <CrossChainFromToTag
      currentAddress={ currentAddress }
      sender={ data.sender?.hash }
      recipient={ data.recipient?.hash }
      isLoading={ isLoading }
    />
  );
};

export default React.memo(CrossChainFromToTagTx);
