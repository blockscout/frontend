import { Button, Icon } from '@chakra-ui/react';
import React from 'react';

import arrowIcon from 'icons/arrows/east-mini.svg';
import rocketIcon from 'icons/rocket.svg';

interface Props {
  onClick: () => void;
  isOpen: boolean;
}

const TriggerButton = ({ isOpen, onClick }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  return (
    <Button
      ref={ ref }
      size="sm"
      variant="outline"
      colorScheme="gray"
      onClick={ onClick }
      aria-label="Show project info"
      fontWeight={ 500 }
      px={ 2 }
      h="32px"
    >
      <Icon as={ rocketIcon } boxSize={ 5 } mr={ 1 }/>
      <span>Info</span>
      <Icon as={ arrowIcon } transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="faster" boxSize={ 5 } ml={ 1 }/>
    </Button>
  );
};

export default React.forwardRef(TriggerButton);
