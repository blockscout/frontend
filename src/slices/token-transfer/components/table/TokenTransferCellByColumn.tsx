// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransferColumnId } from '../../types/client';
import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import { getTokenTypeName, isConfidentialTokenType, NFT_TOKEN_TYPE_IDS } from 'src/slices/token/utils/token-types';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import AddressFromToTag from 'src/slices/address/components/from-to/AddressFromToTag';
import { getTxCourseType } from 'src/slices/address/utils/tx';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import NftEntity from 'src/slices/token/components/entity/NftEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import { formatUiMultiplier } from 'src/slices/token/utils/ui-multiplier';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import AssetValue from 'src/shared/values/entity/AssetValue';
import calculateUsdValue from 'src/shared/values/entity/calculateUsdValue';
import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'src/shared/values/entity/utils';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

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

const InOutCell = ({ item, isLoading, baseAddress }: CellProps) => {
  const type = getTxCourseType(item.from.hash, item.to?.hash, baseAddress);
  if (type === 'unspecified') {
    return <Dash isLoading={ isLoading }/>;
  }
  return <AddressFromToTag type={ type } isLoading={ isLoading }/>;
};

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
  <AddressFromTo
    plainArrow
    from={ item.from }
    to={ item.to }
    current={ baseAddress }
    tokenHash={ item.token?.address_hash }
    tokenSymbol={ item.token?.symbol ?? undefined }
    isLoading={ isLoading }
    mode="long"
  />
);

const MultiplierCell = ({ item, isLoading, chainConfig }: CellProps) => {
  const multiplier = getTokenTransferUiMultiplier(item, chainConfig);
  if (!multiplier) {
    return <Dash isLoading={ isLoading }/>;
  }
  return (
    <Truncate
      value={ formatUiMultiplier(multiplier) }
      loading={ isLoading }
      color="text.secondary"
      type="end"
      maxW="100%"
      display="block"
    />
  );
};

const AmountCell = ({ item, isLoading, chainConfig }: CellProps) => {
  const amount = getFungibleAmount(item);
  if (!amount) {
    if (getNftTokenId(item) !== undefined) {
      return <Skeleton loading={ isLoading }>1</Skeleton>;
    }
    return item.token && isConfidentialTokenType(item.token.type) ?
      <ConfidentialValue loading={ isLoading }/> :
      <Dash isLoading={ isLoading }/>;
  }
  return (
    <AssetValue
      amount={ amount.value }
      decimals={ amount.decimals }
      multiplier={ getTokenTransferUiMultiplier(item, chainConfig) }
      loading={ isLoading }
    />
  );
};

const AssetCell = ({ item, isLoading, tokenId, instance }: CellProps) => {
  if (!item.token) {
    return <Dash isLoading={ isLoading }/>;
  }
  const nftTokenId = getNftTokenId(item);
  if (nftTokenId === undefined) {
    return <TokenEntity token={ item.token } isLoading={ isLoading } noCopy onlySymbol icon={{ marginRight: 1 }}/>;
  }
  const rowInstance = item.total && 'token_instance' in item.total ? item.total.token_instance : undefined;
  return (
    <Flex alignItems="center" columnGap={ 2 }>
      <NftEntity
        hash={ item.token.address_hash }
        id={ nftTokenId }
        instance={ instance ?? rowInstance }
        noLink={ tokenId === nftTokenId }
        isLoading={ isLoading }
        w="auto"
        maxW="50%"
      />
      <TokenEntity
        token={ item.token }
        isLoading={ isLoading }
        noIcon
        noCopy
        onlySymbol
        w="auto"
        maxW="50%"
      />
    </Flex>
  );
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
    case 'in_out':
      return <InOutCell { ...rest }/>;
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
    case 'multiplier':
      return <MultiplierCell { ...rest }/>;
    case 'amount':
      return <AmountCell { ...rest }/>;
    case 'asset':
      return <AssetCell { ...rest }/>;
    case 'value':
      return <ValueCell { ...rest }/>;
  }
};

export default React.memo(TokenTransferCellByColumn);
