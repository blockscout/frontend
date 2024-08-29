import { Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AdvancedFilterResponseItem } from 'types/api/advancedFilter';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import type { ColumnsIds } from 'ui/pages/AdvancedFilter';
import AddressFromToIcon from 'ui/shared/address/AddressFromToIcon';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

import { ADVANCED_FILTER_TYPES } from './constants';

type Props = {
  item: AdvancedFilterResponseItem;
  column: ColumnsIds;
  isLoading?: boolean;
}
const ItemByColumn = ({ item, column, isLoading }: Props) => {
  switch (column) {
    case 'tx_hash':
      return <TxEntity truncation="constant_long" hash={ item.hash } isLoading={ isLoading } noIcon fontWeight={ 700 }/>;
    case 'type': {
      const type = ADVANCED_FILTER_TYPES.find(t => t.id === item.type);
      if (!type) {
        return null;
      }
      return <Tag isLoading={ isLoading }>{ type.name }</Tag>;
    }
    case 'method':
      return item.method ? <Tag isLoading={ isLoading } isTruncated colorScheme="gray-blue">{ item.method }</Tag> : null;
    case 'age':
      return <TimeAgoWithTooltip timestamp={ item.timestamp } isLoading={ isLoading } color="text_secondary" fontWeight={ 400 }/>;
    case 'from':
      return (
        <Flex w="100%" justifyContent="space-between">
          <AddressEntity address={ item.from } truncation="constant" isLoading={ isLoading }/>
        </Flex>
      );
    case 'to':
      return <AddressEntity address={ item.to ? item.to : item.created_contract } truncation="constant" isLoading={ isLoading }/>;
    case 'or_and':
      return (
        <AddressFromToIcon
          isLoading={ isLoading }
          type="unspecified"
        />
      );
    case 'amount': {
      if (item.token?.type === 'ERC-721') {
        return <Skeleton isLoaded={ !isLoading }>1</Skeleton>;
      }
      if (item.total) {
        return (
          <Skeleton isLoaded={ !isLoading }>
            { getCurrencyValue({ value: item.total?.value, decimals: item.total.decimals, accuracy: 8 }).valueStr }
          </Skeleton>
        );
      }
      if (item.value) {
        return (
          <Skeleton isLoaded={ !isLoading }>
            { getCurrencyValue({ value: item.value, decimals: config.chain.currency.decimals.toString(), accuracy: 8 }).valueStr }
          </Skeleton>
        );
      }
      return null;
    }
    case 'asset':
      return item.token ?
        <TokenEntity token={ item.token } isLoading={ isLoading } fontWeight={ 700 } onlySymbol noCopy/> :
        <Skeleton isLoaded={ !isLoading } fontWeight={ 700 }>{ config.chain.currency.symbol }</Skeleton>;
    case 'fee':
      return <Skeleton isLoaded={ !isLoading }>{ item.fee ? getCurrencyValue({ value: item.fee, accuracy: 8 }).valueStr : '-' }</Skeleton>;
    default:
      return null;
  }
};

export default ItemByColumn;
