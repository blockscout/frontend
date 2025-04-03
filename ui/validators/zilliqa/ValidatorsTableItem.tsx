import BigNumber from 'bignumber.js';
import React from 'react';

import type { ValidatorsZilliqaItem } from 'types/api/validators';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import ValidatorEntity from 'ui/shared/entities/validator/ValidatorEntity';

interface Props {
  data: ValidatorsZilliqaItem;
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
        <Skeleton loading={ isLoading } display="inline-block">
          { BigNumber(data.balance).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ValidatorsTableItem);
