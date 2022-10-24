import { HStack, Flex } from '@chakra-ui/react';
import React from 'react';

import type { Sort } from 'types/client/txs-sort';

import useIsMobile from 'lib/hooks/useIsMobile';
// import FilterInput from 'ui/shared/FilterInput';
import useScrollVisibility from 'lib/hooks/useScrollVisibility';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import SortButton from 'ui/shared/SortButton';

// import TxsFilters from './TxsFilters';

type Props = {
  sorting: Sort;
  paginationProps: PaginationProps;
}

const TxsHeader = ({ sorting, paginationProps }: Props) => {
  const isVisible = useScrollVisibility('down');

  const isMobile = useIsMobile(false);
  return (
    <Flex
      backgroundColor="white"
      mt={ -6 }
      pt={ 6 }
      pb={ 6 }
      justifyContent="space-between"
      width="100%"
      position="sticky"
      top={{ base: isVisible ? '56px' : '108px', lg: 0 }}
      // transitionDuration="slow"
      // transitionProperty="top"
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
