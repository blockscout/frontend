import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ValidatorBlackfort } from 'types/api/validators';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TruncatedValue from 'ui/shared/TruncatedValue';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

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
        <NativeCoinValue
          amount={ data.self_bonded_amount }
          loading={ isLoading }
          noSymbol
        />
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <NativeCoinValue
          amount={ data.delegated_amount }
          loading={ isLoading }
          noSymbol
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ValidatorsTableItem);
