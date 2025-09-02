import { useRouter } from 'next/router';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';
import type { TokenType } from 'types/api/token';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import { TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import { getTokenTransfersStub } from 'stubs/token';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

export type Filters = {
  type: Array<TokenType>;
  filter: AddressFromToFilter | undefined;
};

const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPE_IDS);
const getAddressFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

interface Props {
  currentAddress: string;
  enabled?: boolean;
  isMultichain?: boolean;
}

export default function useAddressTokenTransfersQuery({ currentAddress, enabled, isMultichain }: Props) {
  const router = useRouter();

  const [ filters, setFilters ] = React.useState<Filters>(
    {
      type: getTokenFilterValue(router.query.type) || [],
      filter: getAddressFilterValue(router.query.filter),
    },
  );

  const query = useQueryWithPages({
    resourceName: 'general:address_token_transfers',
    pathParams: { hash: currentAddress },
    filters,
    options: {
      enabled,
      placeholderData: getTokenTransfersStub(undefined, {
        block_number: 7793535,
        index: 46,
        items_count: 50,
      }),
    },
    isMultichain,
  });

  const onTypeFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    query.onFilterChange({ ...filters, type: nextValue });
    setFilters((prevState) => ({ ...prevState, type: nextValue }));
  }, [ filters, query ]);

  const onAddressFilterChange = React.useCallback((nextValue: string) => {
    const filterVal = getAddressFilterValue(nextValue);
    query.onFilterChange({ ...filters, filter: filterVal });
    setFilters((prevState) => ({ ...prevState, filter: filterVal }));
  }, [ filters, query ]);

  return React.useMemo(() => ({
    query,
    filters,
    onTypeFilterChange,
    onAddressFilterChange,
  }), [ query, filters, onTypeFilterChange, onAddressFilterChange ]);
}
