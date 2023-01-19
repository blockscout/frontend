import { Tr, Td, Tag, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import appConfig from 'configs/app/config';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';

type Props = {
  item: AddressesItem;
  index: number;
  totalSupply: string;
  hasPercentage: boolean;
}

const AddressesTableItem = ({
  item,
  index,
  totalSupply,
  hasPercentage,
}: Props) => {

  const addressBalance = BigNumber(item.coin_balance).div(BigNumber(10 ** appConfig.network.currency.decimals));
  const addressBalanceChunks = addressBalance.dp(8).toFormat().split('.');

  return (
    <Tr>
      <Td>
        <Text lineHeight="24px">{ index }</Text>
      </Td>
      <Td>
        <Address display="inline-flex" maxW="100%">
          <AddressIcon address={ item } mr={ 2 }/>
          <AddressLink
            fontWeight={ 700 }
            flexGrow={ 1 }
            w="calc(100% - 32px)"
            hash={ item.hash }
            alias={ item.name }
            type="address"
          />
        </Address>
      </Td>
      <Td pl={ 10 }>
        { item.public_tags && item.public_tags.length ? item.public_tags.map(tag => (
          <Tag key={ tag.label }>{ tag.display_name }</Tag>
        )) : <Text lineHeight="24px">-</Text> }
      </Td>
      <Td isNumeric>
        <Text lineHeight="24px" as="span">{ addressBalanceChunks[0] }</Text>
        { addressBalanceChunks[1] && <Text lineHeight="24px" as="span">.</Text> }
        <Text lineHeight="24px" variant="secondary" as="span">{ addressBalanceChunks[1] }</Text>
      </Td>
      { hasPercentage && (
        <Td isNumeric>
          <Text lineHeight="24px">{ addressBalance.div(BigNumber(totalSupply)).multipliedBy(100).dp(8).toFormat() + '%' }</Text>
        </Td>
      ) }
      <Td isNumeric>
        <Text lineHeight="24px">{ Number(item.tx_count).toLocaleString('en') }</Text>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressesTableItem);
