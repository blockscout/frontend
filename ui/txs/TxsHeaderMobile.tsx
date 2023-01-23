import { HStack, chakra } from '@chakra-ui/react';
import React from 'react';

import type { Sort } from 'types/client/txs-sort';

// import FilterInput from 'ui/shared/filters/FilterInput';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import TxsSorting from 'ui/txs/TxsSorting';

// import TxsFilters from './TxsFilters';

type Props = {
  sorting: Sort;
  setSorting: (val: Sort) => void;
  paginationProps: PaginationProps;
  className?: string;
  showPagination?: boolean;
  filterComponent?: React.ReactNode;
}

const TxsHeaderMobile = ({ filterComponent, sorting, setSorting, paginationProps, className, showPagination = true }: Props) => {
  return (
    <ActionBar className={ className }>
      <HStack>
        { filterComponent }
        <TxsSorting
          isActive={ Boolean(sorting) }
          setSorting={ setSorting }
          sorting={ sorting }
        />
        { /* api is not implemented */ }
        { /* <FilterInput
          // eslint-disable-next-line react/jsx-no-bind
          onChange={ () => {} }
          maxW="360px"
          size="xs"
          placeholder="Search by addresses, hash, method..."
        /> */ }
      </HStack>
      { showPagination && <Pagination { ...paginationProps }/> }
    </ActionBar>
  );
};

export default chakra(TxsHeaderMobile);
