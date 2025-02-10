import { chakra, IconButton } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  onClick: (e: React.SyntheticEvent) => void;
  isDisabled?: boolean;
  className?: string;
}

const ClearButton = ({ onClick, isDisabled, className }: Props) => {
  // const iconColor = useColorModeValue('gray.300', 'gray.600');
  // const iconColorHover = useColorModeValue('gray.200', 'gray.500');

  return (
    <IconButton
      isDisabled={ isDisabled }
      className={ className }
      colorScheme="none"
      aria-label="Clear input"
      title="Clear input"
      boxSize={ 6 }
      icon={ <IconSvg border="1px solid #FF57B7" borderRadius="50%" color="#FF57B7" w="16px" h="16px" name="cross"/> }
      size="sm"
      onClick={ onClick }
    />
  );
};

export default chakra(ClearButton);
