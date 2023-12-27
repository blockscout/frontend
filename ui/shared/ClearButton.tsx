import { chakra, IconButton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  onClick: (e: React.SyntheticEvent) => void;
  isDisabled?: boolean;
  className?: string;
}

const ClearButton = ({ onClick, isDisabled, className }: Props) => {
  const iconColor = useColorModeValue('gray.300', 'gray.600');
  const iconColorHover = useColorModeValue('gray.200', 'gray.500');

  return (
    <IconButton
      isDisabled={ isDisabled }
      className={ className }
      colorScheme="none"
      aria-label="Clear input"
      title="Clear input"
      boxSize={ 6 }
      icon={ <IconSvg name="status/error" boxSize={ 3 } color={ iconColor } _hover={{ color: iconColorHover }}/> }
      size="sm"
      onClick={ onClick }
    />
  );
};

export default chakra(ClearButton);
