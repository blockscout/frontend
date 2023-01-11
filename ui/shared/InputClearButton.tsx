import { chakra, Icon, IconButton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import crossIcon from 'icons/cross.svg';

interface Props {
  onClick: () => void;
  isDisabled?: boolean;
}

const InputClearButton = ({ onClick, isDisabled }: Props) => {
  const iconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');

  return (
    <IconButton
      isDisabled={ isDisabled }
      colorScheme="gray"
      aria-label="Clear input"
      title="Clear input"
      boxSize={ 6 }
      icon={ <Icon as={ crossIcon } boxSize={ 4 } color={ iconColor }/> }
      size="sm"
      onClick={ onClick }
    />
  );
};

export default chakra(InputClearButton);
