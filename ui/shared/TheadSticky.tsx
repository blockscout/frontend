import { Thead, useColorModeValue } from '@chakra-ui/react';
import type { TableHeadProps, PositionProps } from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import React from 'react';

interface Props extends TableHeadProps {
  top?: number;
  children?: React.ReactNode;
}

const TheadSticky = ({ top, children, ...restProps }: Props) => {
  const ref = React.useRef<HTMLTableSectionElement>(null);
  const [ isSticky, setIsSticky ] = React.useState(false);

  const handleScroll = React.useCallback(() => {
    if (Number(ref.current?.getBoundingClientRect().y) <= (top || 0)) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  }, [ top ]);

  React.useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 300);

    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [ handleScroll ]);

  const props = {
    ...restProps,
    position: 'sticky' as PositionProps['position'],
    top: `${ top }px` || 0,
    backgroundColor: useColorModeValue('white', 'black'),
    boxShadow: isSticky ? 'md' : 'none',
    zIndex: '1',
  };

  return (
    <Thead { ...props } ref={ ref }>
      { children }
    </Thead>
  );
};

export default TheadSticky;
