// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenTransferColumnId } from '../../types/client';
import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import { getTokenTypeName, isConfidentialTokenType, NFT_TOKEN_TYPE_IDS } from 'src/slices/token/utils/token-types';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import NftEntity from 'src/slices/token/components/entity/NftEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import TokenMultiplierTag from 'src/slices/token/components/ui-multiplier/TokenMultiplierTag';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import AssetValue from 'src/shared/values/entity/AssetValue';
import calculateUsdValue from 'src/shared/values/entity/calculateUsdValue';
import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'src/shared/values/entity/utils';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import { getTokenTransferUiMultiplier } from '../../utils/get-token-transfer-ui-multiplier';
import TokenTransferTypeBadge from '../TokenTransferTypeBadge';

export interface Props {
  readonly item: schemas['TokenTransfer'];
  readonly column: TokenTransferColumnId;
  readonly isLoading: boolean | undefined;
  readonly chainConfig: ClusterChainConfig['app_config'] | undefined;
  readonly baseAddress: string | undefined;
  readonly tokenId: string | undefined;
  readonly instance: schemas['TokenInstance'] | undefined;
  readonly enableTimeIncrement: boolean | undefined;
}

type CellProps = Omit<Props, 'column'>;

const Dash = ({ isLoading }: Pick<CellProps, 'isLoading'>) => <Skeleton loading={ isLoading }>-</Skeleton>;

function getFungibleAmount(item: CellProps['item']): { value: string; decimals: string } | undefined {
  if (!item.total || !('value' in item.total) || item.total.value === null) {
    return undefined;
  }
  return { value: item.total.value, decimals: item.total.decimals || '0' };
}

function getNftTokenId(item: CellProps['item']): string | undefined {
  if (!item.token?.type || !NFT_TOKEN_TYPE_IDS.includes(item.token.type)) {
    return undefined;
  }
  if (!item.total || !('token_id' in item.total) || item.total.token_id === null) {
    return undefined;
  }
  return item.total.token_id;
}

const TxHashCell = ({ item, isLoading }: CellProps) => {
  if (!item.transaction_hash) {
    return <Dash isLoading={ isLoading }/>;
  }
  return (
    <TxEntity
      hash={ item.transaction_hash }
      isLoading={ isLoading }
      fontWeight={ 600 }
      noIcon
      truncation="constant"
    />
  );
};

const TypeCell = ({ item, isLoading, chainConfig }: CellProps) => {
  if (item.token?.type) {
    return <Badge loading={ isLoading }>{ getTokenTypeName(item.token.type, chainConfig) }</Badge>;
  }
  return <Dash isLoading={ isLoading }/>;
};

const TransferTypeCell = ({ item, isLoading }: CellProps) => {
  return (
    <TokenTransferTypeBadge
      methodType={ item.type }
      tokenType={ item.token?.type ?? undefined }
      transferTokenType={ item.token_type }
      loading={ isLoading }
    />
  );
};

const MethodCell = ({ item, isLoading }: CellProps) => {
  if (!item.method) {
    return null;
  }
  return <Badge loading={ isLoading } truncated>{ item.method }</Badge>;
};

const TimestampCell = ({ item, isLoading, enableTimeIncrement }: CellProps) => (
  <TimeWithTooltip
    timestamp={ item.timestamp }
    enableIncrement={ enableTimeIncrement }
    isLoading={ isLoading }
    color="text.secondary"
    fontWeight="400"
  />
);

const BlockCell = ({ item, isLoading }: CellProps) => (
  <BlockEntity number={ item.block_number } isLoading={ isLoading } noIcon/>
);

const FromToCell = ({ item, isLoading, baseAddress }: CellProps) => (
  // TODO (design): From/To arrow and column width per mockup; one combined column pending Q02
  <AddressFromTo
    from={ item.from }
    to={ item.to }
    current={ baseAddress }
    tokenHash={ item.token?.address_hash }
    tokenSymbol={ item.token?.symbol ?? undefined }
    isLoading={ isLoading }
    mode="long"
  />
);

const TokenIdCell = ({ item, isLoading, tokenId, instance }: CellProps) => {
  const nftTokenId = getNftTokenId(item);
  if (!item.token || nftTokenId === undefined) {
    return <Dash isLoading={ isLoading }/>;
  }
  const rowInstance = item.total && 'token_instance' in item.total ? item.total.token_instance : undefined;
  return (
    <NftEntity
      hash={ item.token.address_hash }
      id={ nftTokenId }
      instance={ instance || rowInstance }
      noLink={ tokenId === nftTokenId }
      isLoading={ isLoading }
    />
  );
};

const AmountCell = ({ item, isLoading, chainConfig }: CellProps) => {
  const amount = getFungibleAmount(item);
  if (!amount) {
    return item.token && isConfidentialTokenType(item.token.type) ?
      <ConfidentialValue loading={ isLoading }/> :
      <Dash isLoading={ isLoading }/>;
  }
  const multiplier = getTokenTransferUiMultiplier(item, chainConfig);
  return (
    <AssetValue
      amount={ amount.value }
      decimals={ amount.decimals }
      multiplier={ multiplier }
      startElement={ multiplier && <TokenMultiplierTag multiplier={ multiplier } loading={ isLoading } mr={ 2 }/> }
      loading={ isLoading }
    />
  );
};

const AssetCell = ({ item, isLoading }: CellProps) => {
  if (!item.token) {
    return <Dash isLoading={ isLoading }/>;
  }
  return <TokenEntity token={ item.token } isLoading={ isLoading } noCopy onlySymbol icon={{ marginRight: 1 }}/>;
};

const ValueCell = ({ item, isLoading, chainConfig }: CellProps) => {
  const amount = getFungibleAmount(item);
  const exchangeRate = item.token?.exchange_rate;
  if (!amount || !exchangeRate) {
    return <Dash isLoading={ isLoading }/>;
  }
  const { usdBn } = calculateUsdValue({
    amount: amount.value,
    decimals: amount.decimals,
    exchangeRate,
    multiplier: getTokenTransferUiMultiplier(item, chainConfig),
  });
  return <SimpleValue value={ usdBn } accuracy={ DEFAULT_ACCURACY_USD } prefix="$" loading={ isLoading }/>;
};

const TokenTransferCellByColumn = ({ column, ...rest }: Props) => {
  switch (column) {
    case 'tx_hash':
      return <TxHashCell { ...rest }/>;
    case 'type':
      return <TypeCell { ...rest }/>;
    case 'transfer_type':
      return <TransferTypeCell { ...rest }/>;
    case 'method':
      return <MethodCell { ...rest }/>;
    case 'timestamp':
      return <TimestampCell { ...rest }/>;
    case 'block':
      return <BlockCell { ...rest }/>;
    case 'from_to':
      return <FromToCell { ...rest }/>;
    case 'token_id':
      return <TokenIdCell { ...rest }/>;
    case 'amount':
      return <AmountCell { ...rest }/>;
    case 'asset':
      return <AssetCell { ...rest }/>;
    case 'value':
      return <ValueCell { ...rest }/>;
  }
};

export default React.memo(TokenTransferCellByColumn);
