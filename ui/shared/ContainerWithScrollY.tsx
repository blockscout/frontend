import { Flex, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
  containerId?: string;
  gradientHeight: number;
  className?: string;
  hasScroll: boolean;
}

const ContainerWithScrollY = ({ className, hasScroll, containerId, gradientHeight, children }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const gradientStartColor = useColorModeValue('whiteAlpha.600', 'blackAlpha.600');
  const gradientEndColor = useColorModeValue('whiteAlpha.900', 'blackAlpha.900');

  return (
    <Flex
      id={ containerId }
      flexDirection="column"
      className={ className }
      overflowY={ hasScroll ? 'scroll' : 'auto' }
      ref={ ref }
      _after={ hasScroll ? {
        position: 'absolute',
        content: '""',
        bottom: 0,
        left: 0,
        right: '20px',
        height: `${ gradientHeight }px`,
        bgGradient: `linear(to-b, ${ gradientStartColor } 37.5%, ${ gradientEndColor } 77.5%)`,
      } : undefined }
      pr={ hasScroll ? 5 : 0 }
      pb={ hasScroll ? `${ gradientHeight }px` : 0 }
    >
      { children }
    </Flex>
  );
};

export default chakra(React.forwardRef(ContainerWithScrollY));
