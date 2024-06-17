import { Button } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  onClick: () => void;
  onlyIcon?: boolean;
  isActive?: boolean;
}

const TriggerButton = ({ onClick, onlyIcon, isActive }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  return (
    <Button
      ref={ ref }
      size="sm"
      variant="outline"
      colorScheme="gray"
      onClick={ onClick }
      isActive={ isActive }
      aria-label="Show project info"
      fontWeight={ 500 }
      px={ onlyIcon ? 1 : 2 }
      h="32px"
    >
      <IconSvg name="info" boxSize={ 6 } mr={ onlyIcon ? 0 : 1 }/>
      { !onlyIcon && <span>Info</span> }
    </Button>
  );
};

export default React.forwardRef(TriggerButton);
