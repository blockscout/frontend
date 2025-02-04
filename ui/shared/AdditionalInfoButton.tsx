import {
  chakra,
  Button,
} from '@chakra-ui/react';
import React from 'react';

import Skeleton from 'ui/shared/chakra/Skeleton';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isOpen?: boolean;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
}

const AdditionalInfoButton = ({ isOpen, onClick, className, isLoading }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  if (isLoading) {
    return <Skeleton boxSize={ 6 } borderRadius="sm" flexShrink={ 0 }/>;
  }

  return (
    <Button
      variant="unstyled"
      display="inline-flex"
      alignItems="center"
      className={ className }
      ref={ ref }
      borderRadius="8px"
      w="24px"
      h="24px"
      onClick={ onClick }
      cursor="pointer"
      flexShrink={ 0 }
      aria-label="Transaction info"
    >
      <IconSvg
        name="info"
        boxSize={ 5 }
        color={ isOpen ? 'white' : 'white' }
        _hover={{ color: 'white' }}
      />
    </Button>
  );
};

export default chakra(React.forwardRef(AdditionalInfoButton));
