// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ValidatorBlackfort } from 'src/features/chain-variants/blackfort/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { TruncatedText } from 'src/toolkit/components/truncation/TruncatedText';

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
          <TruncatedText text={ data.name } loading={ isLoading }/>
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
