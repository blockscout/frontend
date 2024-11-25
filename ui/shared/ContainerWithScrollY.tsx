import { Flex, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

export type Props = {
  children: React.ReactNode;
  gradientHeight: number;
  className?: string;
  onScrollVisibilityChange?: (isVisible: boolean) => void;
};

const ContainerWithScrollY = ({ className, gradientHeight, children, onScrollVisibilityChange }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ hasScroll, setHasScroll ] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const hasScroll = ref.current.scrollHeight >= ref.current.clientHeight + gradientHeight / 2;
    setHasScroll(hasScroll);
    onScrollVisibilityChange?.(hasScroll);
  }, [ gradientHeight, onScrollVisibilityChange ]);

  const gradientEndColor = useColorModeValue('white', 'black');

  return (
    <Flex
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
        bgGradient: `linear(to-b, transparent, ${ gradientEndColor })`,
      } : undefined }
      pr={ hasScroll ? 5 : 0 }
      pb={ hasScroll ? `${ gradientHeight }px` : 0 }
    >
      { children }
    </Flex>
  );
};

export default chakra(ContainerWithScrollY);
