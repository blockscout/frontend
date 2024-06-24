import {
  useRadio,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import type { useRadioGroup } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

export interface TOption<Sort extends string> {
  id: Sort | undefined;
  title: string;
}

type OptionProps = ReturnType<ReturnType<typeof useRadioGroup>['getRadioProps']>;

const Option = (props: OptionProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();
  const bgColorHover = useColorModeValue('blue.50', 'whiteAlpha.100');

  return (
    <Box
      as="label"
      px={ 4 }
      py={ 2 }
      cursor="pointer"
      display="flex"
      columnGap={ 2 }
      alignItems="center"
      _hover={{
        bgColor: bgColorHover,
      }}
    >
      <input { ...input }/>
      <Box { ...checkbox }>
        { props.children }
      </Box>
      { props.isChecked && <IconSvg name="check" boxSize={ 4 } color="blue.600"/> }
    </Box>
  );
};

export default Option;
