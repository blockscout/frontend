// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenType } from '../../types/api';

import { ADDRESS_TOKEN_BALANCE_ERC_20 } from 'src/slices/address/stubs/address';

import { usePaginationParams } from 'src/shared/pagination/usePaginationParams';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getFilterValuesFromQuery from 'src/shared/router/get-filter-values-from-query';

import { FUNGIBLE_TOKEN_TYPES } from './utils';

const getTokenFilterValue: (type: string | Array<string> | undefined) => Array<TokenType> | undefined =
    (getFilterValuesFromQuery<TokenType>).bind(null, FUNGIBLE_TOKEN_TYPES);

interface Props {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  enabled?: boolean;
  addressHash: string;
}

export default function useAddressFungibleTokensQuery({ scrollRef, enabled, addressHash }: Props) {
  const typeParam = usePaginationParams('core:address_tokens').filters.type;
  const tokenTypes = React.useMemo(() => getTokenFilterValue(typeParam) || FUNGIBLE_TOKEN_TYPES, [ typeParam ]);

  const query = useQueryWithPages({
    resourceName: 'core:address_tokens',
    pathParams: { hash: addressHash },
    queryParams: { type: tokenTypes },
    scrollRef,
    options: {
      enabled,
      refetchOnMount: false,
      placeholderData: generateListStub<'core:address_tokens'>(ADDRESS_TOKEN_BALANCE_ERC_20, 10, { next_page_params: null }),
    },
  });

  const { onFilterChange } = query;
  const onTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    onFilterChange({ type: value });
  }, [ onFilterChange ]);

  return React.useMemo(() => ({
    query,
    tokenTypes,
    onTokenTypesChange,
  }), [ query, tokenTypes, onTokenTypesChange ]);
}
