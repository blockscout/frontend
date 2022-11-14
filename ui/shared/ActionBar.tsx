import { Flex, useColorModeValue, chakra } from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import React from 'react';

import ScrollDirectionContext from 'ui/ScrollDirectionContext';

type Props = {
  children: React.ReactNode;
  className?: string;
}

const TOP_UP = 106;
const TOP_DOWN = 0;

const ActionBar = ({ children, className }: Props) => {
  const [ isSticky, setIsSticky ] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleScroll = React.useCallback(() => {
    if (
      Number(ref.current?.getBoundingClientRect().y) < TOP_UP + 5
    ) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  }, [ ]);

  React.useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 300);

    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  // replicate componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const bgColor = useColorModeValue('white', 'black');

  return (
    <ScrollDirectionContext.Consumer>
      { (scrollDirection) => (
        <Flex
          className={ className }
          backgroundColor={ bgColor }
          py={ 6 }
          mx={{ base: -4, lg: 0 }}
          px={{ base: 4, lg: 0 }}
          justifyContent="space-between"
          width={{ base: '100vw', lg: 'unset' }}
          position="sticky"
          top={{ base: scrollDirection === 'down' ? `${ TOP_DOWN }px` : `${ TOP_UP }px`, lg: 0 }}
          transitionProperty="top,box-shadow,background-color,color"
          transitionDuration="slow"
          zIndex={{ base: 'sticky2', lg: 'docked' }}
          boxShadow={{ base: isSticky ? 'md' : 'none', lg: 'none' }}
          ref={ ref }
        >
          { children }
        </Flex>
      ) }
    </ScrollDirectionContext.Consumer>
  );
};

export default chakra(ActionBar);
