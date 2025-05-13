import { Text, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tag } from 'toolkit/chakra/tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

type Props = {
  item: AddressesItem;
  index: number;
  totalSupply: BigNumber;
  hasPercentage: boolean;
  isLoading?: boolean;
};

const AddressesTableItem = ({
  item,
  index,
  totalSupply,
  hasPercentage,
  isLoading,
}: Props) => {

  const addressBalance = BigNumber(item.coin_balance || 0).div(BigNumber(10 ** config.chain.currency.decimals));
  const addressBalanceChunks = addressBalance.dp(8).toFormat().split('.');

  return (
    <TableRow>
      <TableCell>
        <Skeleton loading={ isLoading } display="inline-block" minW={ 6 } lineHeight="24px">
          { index }
        </Skeleton>
      </TableCell>
      <TableCell>
        <Flex alignItems="center" columnGap={ 2 }>
          <AddressEntity
            address={ item }
            isLoading={ isLoading }
            fontWeight={ 700 }
            my="2px"
          />
          { item.public_tags && item.public_tags.length ? item.public_tags.map(tag => (
            <Tag key={ tag.label } loading={ isLoading } truncated>{ tag.display_name }</Tag>
          )) : null }
        </Flex>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" maxW="100%">
          <Text lineHeight="24px" as="span">{ addressBalanceChunks[0] + (addressBalanceChunks[1] ? '.' : '') }</Text>
          <Text lineHeight="24px" color="text.secondary" as="span">{ addressBalanceChunks[1] }</Text>
        </Skeleton>
      </TableCell>
      { hasPercentage && (
        <TableCell isNumeric>
          <Text lineHeight="24px">{ addressBalance.div(totalSupply).multipliedBy(100).dp(8).toFormat() + '%' }</Text>
        </TableCell>
      ) }
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" lineHeight="24px">
          { Number(item.transactions_count).toLocaleString() }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AddressesTableItem);
