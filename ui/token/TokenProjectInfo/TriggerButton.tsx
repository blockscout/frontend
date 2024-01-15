import { Button } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

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
      <IconSvg name="rocket" boxSize={ 5 } mr={ 1 }/>
      <span>Info</span>
      <IconSvg name="arrows/east-mini" transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="faster" boxSize={ 5 } ml={ 1 }/>
    </Button>
  );
};

export default React.forwardRef(TriggerButton);
