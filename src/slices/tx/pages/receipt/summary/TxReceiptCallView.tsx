// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TxReceiptParties from './TxReceiptParties';
import TxReceiptSummaryPanel from './TxReceiptSummaryPanel';

interface Props {
  readonly method: string;
  readonly from: schemas['Address'];
  readonly to: schemas['Address'];
  readonly isLoading: boolean;
}

const TxReceiptCallView = ({ method, from, to, isLoading }: Props) => {
  return (
    <TxReceiptSummaryPanel
      action="Call"
      parties={ <TxReceiptParties from={ from } to={ to } connector="interacted with" isLoading={ isLoading }/> }
      isLoading={ isLoading }
    >
      <Skeleton loading={ isLoading } overflowWrap="anywhere">
        { method }
      </Skeleton>
    </TxReceiptSummaryPanel>
  );
};

export default React.memo(TxReceiptCallView);
