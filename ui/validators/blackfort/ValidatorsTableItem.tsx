import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { ValidatorBlackfort } from 'types/api/validators';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TruncatedValue from 'ui/shared/TruncatedValue';

interface Props {
  data: ValidatorBlackfort;
  isLoading?: boolean;
}

const ValidatorsTableItem = ({ data, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <AddressEntity
          address={ data.address }
          isLoading={ isLoading }
          truncation="constant"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Flex>
          <TruncatedValue value={ data.name } isLoading={ isLoading }/>
        </Flex>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading }>
          { `${ data.commission / 100 }%` }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading }>
          { BigNumber(data.self_bonded_amount).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading }>
          { BigNumber(data.delegated_amount).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ValidatorsTableItem);
