import type { UseRadioProps } from '@chakra-ui/react';
import { Box, useRadio, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import IconSvg from '../IconSvg';

interface Props extends UseRadioProps {
  children: React.ReactNode;
}

const SelectOption = (props: Props) => {
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
      { props.isChecked ? <IconSvg name="check" boxSize={ 5 }/> : <Box boxSize={ 5 }/> }
      <input { ...input }/>
      <Box { ...checkbox }>
        { props.children }
      </Box>
    </Box>
  );
};

export default React.memo(SelectOption);
