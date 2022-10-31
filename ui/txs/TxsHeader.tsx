import { HStack, Flex, useColorModeValue } from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import React, { useCallback } from 'react';

import type { Sort } from 'types/client/txs-sort';

import useIsMobile from 'lib/hooks/useIsMobile';
// import FilterInput from 'ui/shared/FilterInput';
import ScrollDirectionContext from 'ui/ScrollDirectionContext';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import TxsSorting from 'ui/txs/TxsSorting';

// import TxsFilters from './TxsFilters';

type Props = {
  sorting: Sort;
  setSorting: (val: Sort | ((val: Sort) => Sort)) => void;
  paginationProps: PaginationProps;
}

const TOP_UP = 106;
const TOP_DOWN = 0;

const TxsHeader = ({ sorting, setSorting, paginationProps }: Props) => {
  const [ isSticky, setIsSticky ] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile(false);

  const handleScroll = useCallback(() => {
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
          backgroundColor={ bgColor }
          mt={ -6 }
          pt={ 6 }
          pb={ 6 }
          mx={{ base: -4, lg: 0 }}
          px={{ base: 4, lg: 0 }}
          justifyContent="space-between"
          width={{ base: '100vw', lg: 'unset' }}
          position="sticky"
          top={{ base: scrollDirection === 'down' ? `${ TOP_DOWN }px` : `${ TOP_UP }px`, lg: 0 }}
          transitionProperty="top,box-shadow"
          transitionDuration="slow"
          zIndex={{ base: 'sticky2', lg: 'docked' }}
          boxShadow={{ base: isSticky ? 'md' : 'none', lg: 'none' }}
          ref={ ref }
        >
          <HStack>
            { /* api is not implemented */ }
            { /* <TxsFilters
          filters={ filters }
          onFiltersChange={ setFilters }
          appliedFiltersNum={ 0 }
        /> */ }
            { isMobile && (
              <TxsSorting
                isActive={ Boolean(sorting) }
                setSorting={ setSorting }
                sorting={ sorting }
              />
            ) }
            { /* api is not implemented */ }
            { /* <FilterInput
          // eslint-disable-next-line react/jsx-no-bind
          onChange={ () => {} }
          maxW="360px"
          size="xs"
          placeholder="Search by addresses, hash, method..."
        /> */ }
          </HStack>
          <Pagination { ...paginationProps }/>
        </Flex>
      ) }
    </ScrollDirectionContext.Consumer>
  );
};

export default TxsHeader;
