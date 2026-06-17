// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import config from 'src/config';
import SimpleValue from 'src/shared/values/entity/SimpleValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';

interface Props {
  item: schemas['TopAddress'];
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
        <SimpleValue
          value={ addressBalance }
          loading={ isLoading }
          lineHeight="24px"
        />
      </TableCell>
      { hasPercentage && (
        <TableCell isNumeric>
          <SimpleValue
            value={ addressBalance.div(totalSupply).multipliedBy(100) }
            loading={ isLoading }
            postfix="%"
            lineHeight="24px"
          />
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
