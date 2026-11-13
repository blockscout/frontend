// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import config from 'src/config';

import { getFallbackSummary } from './get-fallback-summary';
import TxReceiptCallView from './TxReceiptCallView';
import type { TxReceiptTransferAsset } from './TxReceiptTransferView';
import TxReceiptTransferView from './TxReceiptTransferView';

const NATIVE_COIN: TxReceiptTransferAsset = { type: 'native' };

interface Props {
  readonly data: schemas['TransactionResponse'];
  readonly isLoading: boolean;
}

const TxReceiptSummary = ({ data, isLoading }: Props) => {
  const summary = getFallbackSummary(data, config.chain.currency.decimals);

  switch (summary.type) {
    case 'call':
      return <TxReceiptCallView method={ summary.method } from={ summary.from } to={ summary.to } isLoading={ isLoading }/>;
    case 'transfer':
      return <TxReceiptTransferView amount={ summary.amount } asset={ NATIVE_COIN } from={ summary.from } to={ summary.to } isLoading={ isLoading }/>;
  }
};

export default React.memo(TxReceiptSummary);
