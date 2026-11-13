// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import TokenIconNative from 'src/slices/token/components/icon/TokenIconNative';

import config from 'src/config';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import { formatTransferAmount } from './format-transfer-amount';
import TxReceiptParties from './TxReceiptParties';
import TxReceiptSummaryPanel from './TxReceiptSummaryPanel';

export type TxReceiptTransferAsset =
  { readonly type: 'native' } |
  { readonly type: 'token'; readonly token: schemas['Token'] };

const TOKEN_ICON = { marginRight: 1 };

const TxReceiptTransferAssetView = ({ asset }: { readonly asset: TxReceiptTransferAsset }) => {
  switch (asset.type) {
    case 'native':
      return (
        <Flex alignItems="center" columnGap={ 1 } flexShrink={ 0 }>
          <TokenIconNative boxSize={ 5 }/>
          <span>{ config.chain.currency.symbol }</span>
        </Flex>
      );
    case 'token':
      return <TokenEntity token={ asset.token } noLink noCopy onlySymbol icon={ TOKEN_ICON } minW={ 0 }/>;
  }
};

interface Props {
  readonly amount: string;
  readonly asset: TxReceiptTransferAsset;
  readonly from: schemas['Address'];
  readonly to: schemas['Address'] | null;
  readonly isLoading: boolean;
}

const TxReceiptTransferView = ({ amount, asset, from, to, isLoading }: Props) => {
  return (
    <TxReceiptSummaryPanel
      action="Transfer"
      parties={ <TxReceiptParties from={ from } to={ to } connector="to" isLoading={ isLoading }/> }
      isLoading={ isLoading }
    >
      <Skeleton loading={ isLoading } display="flex" alignItems="center" justifyContent="center" columnGap={ 2 }>
        <chakra.span flexShrink={ 0 }>{ formatTransferAmount(amount) }</chakra.span>
        <TxReceiptTransferAssetView asset={ asset }/>
      </Skeleton>
    </TxReceiptSummaryPanel>
  );
};

export default React.memo(TxReceiptTransferView);
