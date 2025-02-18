import { Tr, Td } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { ValidatorsZilliqaItem } from 'types/api/validators';

import config from 'configs/app';
import Skeleton from 'ui/shared/chakra/Skeleton';
import ValidatorEntity from 'ui/shared/entities/validator/ValidatorEntity';

interface Props {
  data: ValidatorsZilliqaItem;
  isLoading?: boolean;
}

const ValidatorsTableItem = ({ data, isLoading }: Props) => {
  return (
    <Tr>
      <Td verticalAlign="middle">
        <ValidatorEntity id={ data.bls_public_key } isLoading={ isLoading } fontWeight="700"/>
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { data.index }
        </Skeleton>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { BigNumber(data.balance).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(ValidatorsTableItem);
