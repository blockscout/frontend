import { HStack, Flex, useColorModeValue } from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import React, { useCallback } from 'react';

import type { Sort } from 'types/client/txs-sort';

import useIsMobile from 'lib/hooks/useIsMobile';
// import FilterInput from 'ui/shared/FilterInput';
import useScrollDirection from 'lib/hooks/useScrollDirection';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import SortButton from 'ui/shared/SortButton';

// import TxsFilters from './TxsFilters';

type Props = {
  sorting: Sort;
  paginationProps: PaginationProps;
}

const TOP_UP = 106;
const TOP_DOWN = 0;

const TxsHeader = ({ sorting, paginationProps }: Props) => {
  const scrollDirection = useScrollDirection();
  const [ isSticky, setIsSticky ] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile(false);

  const handleScroll = useCallback(() => {
    if (
      Number(ref.current?.getBoundingClientRect().y) <= TOP_DOWN ||
      (scrollDirection === 'up' && Number(ref.current?.getBoundingClientRect().y) <= TOP_UP)
    ) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  }, [ scrollDirection ]);

  React.useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 300);

    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [ handleScroll ]);

  return (
    <Flex
      backgroundColor={ useColorModeValue('white', 'black') }
      mt={ -6 }
      pt={ 6 }
      pb={ 6 }
      mx={{ base: -4, lg: 0 }}
      px={{ base: 4, lg: 0 }}
      justifyContent="space-between"
      width={{ base: '100vw', lg: 'unset' }}
      position="sticky"
      top={{ base: scrollDirection === 'down' ? `${ TOP_DOWN }px` : `${ TOP_UP }px`, lg: 0 }}
      transitionProperty="top"
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
          <SortButton
            // eslint-disable-next-line react/jsx-no-bind
            handleSort={ () => {} }
            isSortActive={ Boolean(sorting) }
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
  );
};

export default TxsHeader;
