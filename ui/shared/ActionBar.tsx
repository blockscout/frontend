import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import { useScrollDirection } from 'lib/contexts/scrollDirection';
import { useIsSticky } from 'toolkit/hooks/useIsSticky';

type Props = {
  children: React.ReactNode;
  className?: string;
  showShadow?: boolean;
};

const TOP_UP = 106;
const TOP_DOWN = 0;
export const ACTION_BAR_HEIGHT_DESKTOP = 24 + 32 + 12;
export const ACTION_BAR_HEIGHT_MOBILE = 24 + 32 + 24;

const ActionBar = ({ children, className, showShadow }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const scrollDirection = useScrollDirection();
  const isSticky = useIsSticky(ref, TOP_UP + 5);

  if (!React.Children.toArray(children).filter(Boolean).length) {
    return null;
  }

  return (
    <Flex
      className={ className }
      backgroundColor={{ _light: 'white', _dark: 'black' }}
      pt={ 6 }
      mt={ -6 }
      pb={{ base: 6, lg: 3 }}
      mx={{ base: -3, lg: 0 }}
      px={{ base: 3, lg: 0 }}
      justifyContent="space-between"
      width={{ base: '100vw', lg: 'unset' }}
      position="sticky"
      top={{ base: scrollDirection === 'down' ? `${ TOP_DOWN }px` : `${ TOP_UP }px`, lg: 0 }}
      transitionProperty="top,box-shadow,background-color,color"
      transitionDuration="normal"
      zIndex={{ base: 'sticky2', lg: 'docked' }}
      boxShadow={{
        base: isSticky ? 'md' : 'none',
        lg: isSticky && showShadow ? 'action_bar' : 'none',
      }}
      ref={ ref }
    >
      { children }
    </Flex>
  );
};

export default chakra(ActionBar);
