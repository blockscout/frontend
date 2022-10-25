import { HStack, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

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

const TxsHeader = ({ sorting, paginationProps }: Props) => {
  const scrollDirection = useScrollDirection();

  const isMobile = useIsMobile(false);
  return (
    <Flex
      backgroundColor={ useColorModeValue('white', 'black') }
      mt={ -6 }
      pt={ 6 }
      pb={ 6 }
      justifyContent="space-between"
      width="100%"
      position="sticky"
      top="108px"
      transform={ scrollDirection === 'up' ? 'translateY(0)' : 'translateY(-108px)' }
      transitionProperty="transform"
      transitionDuration="slow"
      zIndex={{ base: 0, lg: 'docked' }}
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
