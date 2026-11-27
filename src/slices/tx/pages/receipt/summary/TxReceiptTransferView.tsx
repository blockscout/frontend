// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { TransferAsset } from './types';
import type { schemas } from '@blockscout/api-types';

import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import TokenIconNative from 'src/slices/token/components/icon/TokenIconNative';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import { useTxReceiptChainConfig } from '../useTxReceiptChainConfig';
import { formatTransferAmount } from './format-transfer-amount';
import TxReceiptParties from './TxReceiptParties';
import TxReceiptSummaryPanel from './TxReceiptSummaryPanel';

const TOKEN_ICON = { marginRight: 1 };

const TxReceiptNativeCoinView = () => {
  const { symbol } = useTxReceiptChainConfig().currency;

  return (
    <Flex alignItems="center" columnGap={ 1 } flexShrink={ 0 }>
      <TokenIconNative boxSize={ 5 }/>
      <span>{ symbol }</span>
    </Flex>
  );
};

const TxReceiptTransferAssetView = ({ asset }: { readonly asset: TransferAsset }) => {
  switch (asset.type) {
    case 'native':
      return <TxReceiptNativeCoinView/>;
    case 'token':
      return <TokenEntity token={ asset.token } noLink noCopy onlySymbol icon={ TOKEN_ICON } minW={ 0 }/>;
  }
};

interface Props {
  readonly amount: string;
  readonly asset: TransferAsset;
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
