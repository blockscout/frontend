import { Box, Flex, FormControl, Input, InputGroup, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { SmartContractMethodInput } from 'types/api/contract';

interface Props {
  data: SmartContractMethodInput;
  hideLabel?: boolean; // TODO @tom2drum - remove this prop
  path: string;
  className?: string;
}

const ContractMethodFieldInput = ({ data, hideLabel, path, className }: Props) => {
  const { control } = useFormContext();
  const { field } = useController({ control, name: path });

  const inputBgColor = useColorModeValue('white', 'black');
  const nativeCoinRowBgColor = useColorModeValue('gray.100', 'gray.700');
  const isNativeCoin = data.fieldType === 'native_coin';

  return (
    <Flex
      className={ className }
      alignItems="center"
      columnGap={ 3 }
      w="100%"
      bgColor={ isNativeCoin ? nativeCoinRowBgColor : undefined }
      borderRadius="base"
      px="6px"
      py={ isNativeCoin ? 1 : 0 }
    >
      { !hideLabel && <Box w="250px" fontSize="sm" flexShrink={ 0 } fontWeight={ 500 }>{ data.name || '<arg w/o name>' } ({ data.type })</Box> }
      <FormControl>
        <InputGroup size="xs">
          <Input
            { ...field }
            placeholder={ data.type }
            autoComplete="off"
            bgColor={ inputBgColor }
          />
        </InputGroup>
      </FormControl>
    </Flex>
  );
};

export default chakra(ContractMethodFieldInput);
