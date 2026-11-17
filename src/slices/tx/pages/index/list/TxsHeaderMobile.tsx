// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack, chakra, createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';
import type { TransactionsSortingValue } from 'src/slices/tx/types/api';

// import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import { SORT_OPTIONS, SORT_OPTIONS_WITHOUT_BLOCK } from 'src/slices/tx/hooks/useTxsSort';

import Pagination from 'src/shared/pagination/Pagination';
import Sort from 'src/shared/sort/Sort';

type Props = {
  sorting: TransactionsSortingValue;
  setSorting?: (val: TransactionsSortingValue) => void;
  paginationProps: PaginationParams;
  className?: string;
  showPagination?: boolean;
  filterComponent?: React.ReactNode;
  linkSlot?: React.ReactNode;
  withBlockSort?: boolean;
};

const collection = createListCollection({
  items: SORT_OPTIONS,
});

const collectionWithoutBlock = createListCollection({
  items: SORT_OPTIONS_WITHOUT_BLOCK,
});

const TxsHeaderMobile = ({
  filterComponent,
  sorting,
  setSorting,
  paginationProps,
  className,
  showPagination = true,
  linkSlot,
  withBlockSort = true,
}: Props) => {
  const handleSortValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSorting?.(value[0] as TransactionsSortingValue);
  }, [ setSorting ]);

  if (!filterComponent && !setSorting && !linkSlot && !showPagination) {
    return null;
  }

  return (
    <ActionBar className={ className }>
      <HStack>
        { filterComponent }
        { setSorting && (
          <Sort
            name="transactions_sorting"
            defaultValue={ [ sorting ] }
            collection={ withBlockSort ? collection : collectionWithoutBlock }
            onValueChange={ handleSortValueChange }
            isLoading={ paginationProps.isLoading }
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
        { linkSlot }
      </HStack>
      { showPagination && <Pagination { ...paginationProps }/> }
    </ActionBar>
  );
};

export default chakra(TxsHeaderMobile);
