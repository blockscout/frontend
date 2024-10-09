import { Tr, Td, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { ValidatorStability } from 'types/api/validators';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ValidatorStatus from 'ui/shared/statusTag/ValidatorStabilityStatus';

interface Props {
  data: ValidatorStability;
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
        <ValidatorStatus state={ data.state } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { data.blocks_validated_count.toLocaleString() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(ValidatorsTableItem);
