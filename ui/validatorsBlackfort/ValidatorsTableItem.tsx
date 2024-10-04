import { Tr, Td, Skeleton, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { ValidatorBlackfort } from 'types/api/validators';

import config from 'configs/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TruncatedValue from 'ui/shared/TruncatedValue';

interface Props {
  data: ValidatorBlackfort;
  isLoading?: boolean;
}

const ValidatorsTableItem = ({ data, isLoading }: Props) => {
  return (
    <Tr>
      <Td verticalAlign="middle">
        <AddressEntity
          address={ data.address }
          isLoading={ isLoading }
          truncation="constant"
        />
      </Td>
      <Td verticalAlign="middle">
        <Flex>
          <TruncatedValue value={ data.name } isLoading={ isLoading }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { `${ data.commission / 100 }%` }
        </Skeleton>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { BigNumber(data.self_bonded_amount).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }
        </Skeleton>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { BigNumber(data.delegated_amount).div(BigNumber(10 ** config.chain.currency.decimals)).toFormat() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(ValidatorsTableItem);
