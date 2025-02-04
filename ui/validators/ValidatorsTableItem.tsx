import { Tr, Td } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Validator } from 'types/api/validators';

import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ValidatorStatus from 'ui/shared/statusTag/ValidatorStatus';

interface Props {
  data: Validator;
  isLoading?: boolean;
}

const ValidatorsTableItem = ({ data, isLoading }: Props) => {
  return (
    <Tr>
      <Td textAlign="center">
        { BigNumber(data.id).toFormat() }
      </Td>
      <Td verticalAlign="middle">
        <AddressEntity
          address={ data.address }
          isLoading={ isLoading }
          truncation="constant"
        />
      </Td>
      <Td verticalAlign="middle">
        <ValidatorStatus state={ data.state } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { BigNumber(data.total_rwa_staked).toFormat() }
        </Skeleton>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { BigNumber(data.total_rwa_delegated).toFormat() }
        </Skeleton>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { BigNumber(data.total_rwa_self_staked).toFormat() }
        </Skeleton>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { BigNumber(data.total_fee_reward).toFormat() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(ValidatorsTableItem);
