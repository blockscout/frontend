import type React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import type { TransactionsSortingField, TransactionsSortingValue, TransactionsSorting } from 'types/api/transaction';

import { TX } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';

type Props = {
  hash: string;
  sort?: TransactionsSortingValue;
  filter?: AddressFromToFilter;
  scrollRef?: React.RefObject<HTMLDivElement>;
  enabled: boolean;
}

export default function useAddressTxsQuery({ hash, filter, sort, scrollRef, enabled }: Props) {

  return useQueryWithPages({
    resourceName: 'address_txs',
    pathParams: { hash },
    filters: { filter },
    sorting: getSortParamsFromValue<TransactionsSortingValue, TransactionsSortingField, TransactionsSorting['order']>(sort),
    scrollRef,
    options: {
      enabled,
      refetchOnMount: false,
      placeholderData: generateListStub<'address_txs'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
      } }),
    },
  });
}
