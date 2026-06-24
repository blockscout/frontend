// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ValidatorEntity from 'src/features/chain-variants/zilliqa/components/ValidatorEntity';

import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  data: schemas['ZilliqaStaker'];
  isLoading?: boolean;
}

const ValidatorsTableItem = ({ data, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <ValidatorEntity id={ data.bls_public_key } isLoading={ isLoading } fontWeight="700"/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          { data.index }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <NativeCoinValue
          amount={ data.balance }
          loading={ isLoading }
          noSymbol
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ValidatorsTableItem);
