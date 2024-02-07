import { Box, Flex, FormControl, Input, InputGroup } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { SmartContractMethodInput } from 'types/api/contract';

interface Props {
  data: SmartContractMethodInput;
  hideLabel?: boolean;
  path: string;
}

const ContractMethodFieldInput = ({ data, hideLabel, path }: Props) => {
  const { control } = useFormContext();
  const { field } = useController({ control, name: path });

  return (
    <Flex alignItems="center" columnGap={ 3 } w="100%">
      { !hideLabel && <Box w="200px" fontSize="sm" flexShrink={ 0 }>{ data.name || '<arg w/o name>' } ({ data.type })</Box> }
      <FormControl>
        <InputGroup size="xs">
          <Input
            { ...field }
            placeholder={ data.type }
            autoComplete="off"
          />
        </InputGroup>
        <Box fontSize="xs" color="text_secondary" px={ 2 }>path: { path }</Box>
      </FormControl>
    </Flex>
  );
};

export default ContractMethodFieldInput;
