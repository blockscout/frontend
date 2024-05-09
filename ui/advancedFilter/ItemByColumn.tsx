import { Text } from '@chakra-ui/react';
import React from 'react';

import type { AdvancedFilterResponseItem } from 'types/api/advancedFilter';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import getCurrencyValue from 'lib/getCurrencyValue';
import type { ColumnsIds } from 'ui/pages/AdvancedFilter';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

import { ADVANCED_FILTER_TYPES } from './constants';

type Props = {
  item: AdvancedFilterResponseItem;
  column: ColumnsIds;
}
const ItemByColumn = ({ item, column }: Props) => {
  switch (column) {
    case 'tx_hash':
      return <TxEntity truncation="constant_long" hash={ item.hash }/>;
    case 'type': {
      const type = ADVANCED_FILTER_TYPES.find(t => t.id === item.type);
      if (!type) {
        return null;
      }
      return <Tag>{ type.name }</Tag>;
    }
    case 'method':
      return item.method ? <Tag>{ item.method }</Tag> : null;
    case 'age':
      return <Text>{ dayjs(item.timestamp).fromNow() }</Text>;
    case 'from':
      return <AddressEntity address={ item.from } truncation="constant"/>;
    case 'to':
      return <AddressEntity address={ item.to } truncation="constant"/>;
    case 'amount': {
      if (item.total) {
        return <Text>{ getCurrencyValue({ value: item.total?.value, decimals: item.total.decimals, accuracy: 8 }).valueStr }</Text>;
      }
      if (item.value) {
        return <Text>{ getCurrencyValue({ value: item.value, decimals: config.chain.currency.decimals.toString(), accuracy: 8 }).valueStr }</Text>;
      }
      return null;
    }
    case 'asset':
      return item.token ? <TokenEntity token={ item.token }/> : <Text>{ `${ config.chain.currency.name } (${ config.chain.currency.symbol })` }</Text>;
    case 'fee':
      return <Text>{ item.fee ? getCurrencyValue({ value: item.fee, accuracy: 8 }).valueStr : '-' }</Text>;
    default:
      return null;
  }
};

export default ItemByColumn;
