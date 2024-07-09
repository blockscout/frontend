import { Button, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

type Props = {
  rating?: number;
  fullView?: boolean;
  isActive: boolean;
  onClick: () => void;
};

const TriggerButton = ({ rating, fullView, isActive, onClick }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const textColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');

  return (
    <Button
      ref={ ref }
      size="xs"
      variant="outline"
      border={ 0 }
      p={ 0 }
      onClick={ onClick }
      fontSize={ fullView ? 'md' : 'sm' }
      fontWeight={ fullView ? '400' : '500' }
      lineHeight="21px"
      ml={ fullView ? 3 : 0 }
      isActive={ isActive }
    >
      { !fullView && (
        <IconSvg
          name={ rating ? 'star_filled' : 'star_outline' }
          color={ rating ? 'yellow.400' : 'gray.400' }
          boxSize={ 5 }
          mr={ 1 }
        />
      ) }
      { (rating && !fullView) ? (
        <chakra.span color={ textColor } transition="inherit">{ rating }</chakra.span>
      ) : (
        'Rate it!'
      ) }
    </Button>
  );
};

export default React.forwardRef(TriggerButton);
