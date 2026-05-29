// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ChainInfo } from 'src/features/op-interop/types/api';

import type { EntityProps } from 'src/slices/tx/components/entity/TxEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import TxEntityInterop from 'src/features/op-interop/components/TxEntityInterop';

type Props = {
  init_transaction_hash?: string | null;
  init_chain?: ChainInfo | null;
  isLoading?: boolean;
  truncation?: EntityProps['truncation'];
};
const InteropMessageSourceTx = (props: Props) => {
  if (props.init_chain !== undefined) {
    return (
      <TxEntityInterop
        chain={ props.init_chain }
        hash={ props.init_transaction_hash }
        isLoading={ props.isLoading }
        truncation={ props.truncation || 'constant' }
        noCopy
      />
    );
  }

  if (!props.init_transaction_hash) {
    return 'N/A';
  }

  return (
    <TxEntity
      hash={ props.init_transaction_hash }
      isLoading={ props.isLoading }
      noIcon
      truncation={ props.truncation || 'constant' }
      noCopy
    />
  );
};

export default InteropMessageSourceTx;
