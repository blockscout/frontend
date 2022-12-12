import { omit } from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import { PAGINATION_FIELDS } from 'types/api/pagination';
import { QueryKeys } from 'types/client/queries';

import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/Pagination';
import TxsContent from 'ui/txs/TxsContent';

import AddressTxsFilter from './AddressTxsFilter';

const FILTER_VALUES = [ 'from', 'to' ] as const;

type FilterType = typeof FILTER_VALUES[number];

const getFilterValue = (val: string | Array<string> | undefined): FilterType | undefined => {
  if (typeof val === 'string' && FILTER_VALUES.includes(val as FilterType)) {
    return val as FilterType;
  }
};

const SCROLL_ELEM = 'address-txs';
const SCROLL_OFFSET = -100;

const AddressTxs = () => {
  const router = useRouter();

  const isMobile = useIsMobile();

  const [ filterValue, setFilterValue ] = React.useState<'from' | 'to' | undefined>(getFilterValue(router.query.filter));

  const addressTxsQuery = useQueryWithPages({
    apiPath: `/node-api/addresses/${ router.query.id }/transactions`,
    queryName: QueryKeys.addressTxs,
    filters: { filter: filterValue },
    scroll: { elem: SCROLL_ELEM, offset: SCROLL_OFFSET },
  });

  const handleFilterChange = React.useCallback((val: string | Array<string>) => {

    const newVal = getFilterValue(val);
    setFilterValue(newVal);
    const newQuery = omit(router.query, PAGINATION_FIELDS[QueryKeys.addressTxs], 'page', 'filter');
    if (newVal) {
      newQuery.filter = newVal;
    }
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    ).then(() => {
      scroller.scrollTo(SCROLL_ELEM, { offset: SCROLL_OFFSET });
    });
  }, [ router ]);

  const isPaginatorHidden =
      !addressTxsQuery.isLoading &&
      !addressTxsQuery.isError &&
      addressTxsQuery.pagination.page === 1 &&
      !addressTxsQuery.pagination.hasNextPage;

  const filter = (
    <AddressTxsFilter
      defaultFilter={ filterValue }
      onFilterChange={ handleFilterChange }
      isActive={ Boolean(filterValue) }
    />
  );

  return (
    <Element name={ SCROLL_ELEM }>
      { !isMobile && (
        <ActionBar mt={ -6 }>
          <AddressTxsFilter
            defaultFilter={ filterValue }
            onFilterChange={ handleFilterChange }
            appliedFiltersNum={ filterValue ? 1 : 0 }
          />
          { !isPaginatorHidden && <Pagination { ...addressTxsQuery.pagination }/> }
        </ActionBar>
      ) }
      <TxsContent
        filter={ filter }
        query={ addressTxsQuery }
        showSocketInfo={ false }
        currentAddress={ typeof router.query.id === 'string' ? router.query.id : undefined }
      />
    </Element>
  );
};

export default AddressTxs;
