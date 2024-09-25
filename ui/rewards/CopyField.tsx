import { FormControl, Input, InputGroup, InputRightElement, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

type Props = {
  label: string;
  value: string;
  className?: string;
};

const CopyField = ({ label, value, className }: Props) => {
  const bgColor = ` ${ useColorModeValue('gray.200', 'blackAlpha.900') } !important`;
  return (
    <FormControl variant="floating" id={ label } className={ className }>
      <InputGroup>
        <Input
          readOnly
          fontWeight="500"
          value={ value }
          overflow="hidden"
          textOverflow="ellipsis"
          pr="40px !important"
          bgColor={ bgColor }
          borderColor={ bgColor }
          borderRadius="12px !important"
        />
        <InputPlaceholder text={ label } bgColor={ bgColor }/>
        <InputRightElement w="40px" display="flex" justifyContent="flex-end" pr={ 2 }>
          <CopyToClipboard text={ value }/>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};

export default chakra(CopyField);
