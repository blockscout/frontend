import { chakra, Icon, IconButton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import crossIcon from 'icons/cross.svg';

interface Props {
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
}

const InputClearButton = ({ onClick, isDisabled, className }: Props) => {
  const iconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');

  return (
    <IconButton
      isDisabled={ isDisabled }
      className={ className }
      colorScheme="gray"
      aria-label="Clear input"
      title="Clear input"
      boxSize={ 6 }
      icon={ <Icon as={ crossIcon } boxSize={ 4 } color={ iconColor } focusable={ false }/> }
      size="sm"
      onClick={ onClick }
    />
  );
};

export default chakra(InputClearButton);
