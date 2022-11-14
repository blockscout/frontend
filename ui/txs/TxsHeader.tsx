import { HStack, chakra } from '@chakra-ui/react';
import React from 'react';

import type { Sort } from 'types/client/txs-sort';

import useIsMobile from 'lib/hooks/useIsMobile';
// import FilterInput from 'ui/shared/FilterInput';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import TxsSorting from 'ui/txs/TxsSorting';

// import TxsFilters from './TxsFilters';

type Props = {
  sorting: Sort;
  setSorting: (val: Sort | ((val: Sort) => Sort)) => void;
  paginationProps: PaginationProps;
  className?: string;
}

const TxsHeader = ({ sorting, setSorting, paginationProps, className }: Props) => {
  const isMobile = useIsMobile(false);

  return (
    <ActionBar className={ className }>
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
    </ActionBar>
  );
};

export default chakra(TxsHeader);
