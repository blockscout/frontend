import { Button } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  onClick: () => void;
  isActive: boolean;
}

const TriggerButton = ({ onClick, isActive }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
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
      lineHeight={ 6 }
      pl={ 1 }
      pr={ 2 }
      h="32px"
    >
      <IconSvg name="info" boxSize={ 6 } mr={ 1 }/>
      <span>Info</span>
    </Button>
  );
};

export default React.forwardRef(TriggerButton);
