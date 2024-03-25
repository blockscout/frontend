import { useRouter } from 'next/router';
import type React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';
import type { TransactionsSortingField, TransactionsSortingValue, TransactionsSorting } from 'types/api/transaction';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TX } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import { SORT_OPTIONS } from 'ui/txs/useTxsSort';

type Props = {
  sort?: TransactionsSortingValue;
  filter?: AddressFromToFilter;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

export default function useAddressTxsQuery({ sort: sortProp, filter: filterProp, scrollRef }: Props) {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);
  const filter = filterProp || getFilterValue(router.query.filter);
  const sort = sortProp || getSortValueFromQuery<TransactionsSortingValue>(router.query, SORT_OPTIONS);

  return useQueryWithPages({
    resourceName: 'address_txs',
    pathParams: { hash },
    filters: { filter },
    sorting: getSortParamsFromValue<TransactionsSortingValue, TransactionsSortingField, TransactionsSorting['order']>(sort),
    scrollRef,
    options: {
      enabled: Boolean(hash),
      refetchOnMount: false,
      placeholderData: generateListStub<'address_txs'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
      } }),
    },
  });
}
