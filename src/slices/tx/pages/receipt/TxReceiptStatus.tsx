// SPDX-License-Identifier: LicenseRef-Blockscout

import { Spinner } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxStatus from 'src/slices/tx/components/TxStatus';

interface Props {
  readonly status: schemas['TransactionResponse']['status'];
  readonly isLoading: boolean;
}

const TxReceiptStatus = ({ status, isLoading }: Props) => {
  if (status === null && !isLoading) {
    return <Spinner size="md" role="status" aria-label="Pending"/>;
  }

  return <TxStatus status={ status } isLoading={ isLoading }/>;
};

export default React.memo(TxReceiptStatus);
