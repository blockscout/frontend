import { Box, Flex, FormControl, Input, InputGroup } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractMethodInput } from 'types/api/contract';

interface Props {
  data: SmartContractMethodInput;
  hideLabel?: boolean;
}

const ContractMethodFieldInput = ({ data, hideLabel }: Props) => {
  return (
    <Flex alignItems="center" columnGap={ 3 } w="100%">
      { !hideLabel && <Box w="200px" fontSize="sm" flexShrink={ 0 }>{ data.name || '<arg w/o name>' } ({ data.type })</Box> }
      <FormControl>
        <InputGroup size="xs">
          <Input
            placeholder={ data.type }
            autoComplete="off"
          />
        </InputGroup>
      </FormControl>
    </Flex>
  );
};

export default ContractMethodFieldInput;
