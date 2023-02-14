import { chakra, IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import InfoIcon from 'icons/info.svg';

interface Props {
  text: string;
  className?: string;
}

const Hint = ({ text, className }: Props) => {
  const { isOpen, onOpen, onToggle, onClose } = useDisclosure();

  return (
    <Tooltip
      label={ text }
      placement="top"
      maxW="320px"
      isOpen={ isOpen }
    >
      <IconButton
        colorScheme="none"
        aria-label="hint"
        icon={ <InfoIcon/> }
        boxSize={ 5 }
        variant="simple"
        display="inline-block"
        flexShrink={ 0 }
        className={ className }
        onMouseEnter={ onOpen }
        onMouseLeave={ onClose }
        onClick={ onToggle }
      />
    </Tooltip>
  );
};

export default React.memo(chakra(Hint));
