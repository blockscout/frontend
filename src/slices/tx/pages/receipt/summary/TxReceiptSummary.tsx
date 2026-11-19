// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { TxInterpretationSummary } from 'src/features/tx-interpretation/common/types/api';

import { useTxReceiptChainConfig } from '../useTxReceiptChainConfig';
import { getReceiptSummary } from './get-receipt-summary';
import TxReceiptCallView from './TxReceiptCallView';
import TxReceiptSentenceView from './TxReceiptSentenceView';
import TxReceiptTransferView from './TxReceiptTransferView';

interface Props {
  readonly data: schemas['TransactionResponse'];
  readonly interpretations: ReadonlyArray<TxInterpretationSummary> | undefined;
  readonly isLoading: boolean;
}

const TxReceiptSummary = ({ data, interpretations, isLoading }: Props) => {
  const { decimals } = useTxReceiptChainConfig().currency;
  const summary = React.useMemo(
    () => getReceiptSummary(data, interpretations, decimals),
    [ data, interpretations, decimals ],
  );

  switch (summary.type) {
    case 'call':
      return <TxReceiptCallView method={ summary.method } from={ summary.from } to={ summary.to } isLoading={ isLoading }/>;
    case 'transfer':
      return <TxReceiptTransferView amount={ summary.amount } asset={ summary.asset } from={ summary.from } to={ summary.to } isLoading={ isLoading }/>;
    case 'sentence':
      return <TxReceiptSentenceView summary={ summary } isLoading={ isLoading }/>;
  }
};

export default React.memo(TxReceiptSummary);
