// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ChainInfo } from 'src/features/op-interop/types/api';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';
import type { EntityProps } from 'src/slices/tx/components/entity/TxEntity';

import TxEntityInterop from 'src/features/op-interop/components/TxEntityInterop';

type Props = {
  relay_transaction_hash?: string | null;
  relay_chain?: ChainInfo | null;
  truncation?: EntityProps['truncation'];
  isLoading?: boolean;
};

const InteropMessageDestinationTx = (props: Props) => {
  if (props.relay_chain !== undefined) {
    return (
      <TxEntityInterop
        chain={ props.relay_chain }
        hash={ props.relay_transaction_hash }
        isLoading={ props.isLoading }
        truncation={ props.truncation || 'constant' }
        noCopy
      />
    );
  }

  if (!props.relay_transaction_hash) {
    return 'N/A';
  }

  return (
    <TxEntity
      hash={ props.relay_transaction_hash }
      isLoading={ props.isLoading }
      noIcon
      truncation={ props.truncation || 'constant' }
      noCopy
    />
  );
};

export default InteropMessageDestinationTx;
