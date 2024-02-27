import { HStack, chakra } from '@chakra-ui/react';
import React from 'react';

import type { TransactionsSortingValue } from 'types/api/transaction';
import type { PaginationParams } from 'ui/shared/pagination/types';

// import FilterInput from 'ui/shared/filters/FilterInput';

import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';
import Sort from 'ui/shared/sort/Sort';

import { SORT_OPTIONS } from './useTxsSort';

// import TxsFilters from './TxsFilters';

type Props = {
  sorting: TransactionsSortingValue | undefined;
  setSorting: (val: TransactionsSortingValue | undefined) => void;
  paginationProps: PaginationParams;
  className?: string;
  showPagination?: boolean;
  filterComponent?: React.ReactNode;
  linkSlot?: React.ReactNode;
}

const TxsHeaderMobile = ({ filterComponent, sorting, setSorting, paginationProps, className, showPagination = true, linkSlot }: Props) => {
  return (
    <ActionBar className={ className }>
      <HStack>
        { filterComponent }
        <Sort
          options={ SORT_OPTIONS }
          setSort={ setSorting }
          sort={ sorting }
          isLoading={ paginationProps.isLoading }
        />
        { /* api is not implemented */ }
        { /* <FilterInput
          // eslint-disable-next-line react/jsx-no-bind
          onChange={ () => {} }
          maxW="360px"
          size="xs"
          placeholder="Search by addresses, hash, method..."
        /> */ }
        { linkSlot }
      </HStack>
      { showPagination && <Pagination { ...paginationProps }/> }
    </ActionBar>
  );
};

export default chakra(TxsHeaderMobile);
