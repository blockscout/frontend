// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from '../../types/api';

import { ADDRESS_TOKEN_BALANCE_ERC_20 } from 'src/slices/address/stubs/address';

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
  const router = useRouter();

  const [ tokenTypes, setTokenTypes ] = React.useState<Array<TokenType>>(getTokenFilterValue(router.query.type) || FUNGIBLE_TOKEN_TYPES);

  const query = useQueryWithPages({
    resourceName: 'core:address_tokens',
    pathParams: { hash: addressHash },
    filters: { type: tokenTypes },
    scrollRef,
    options: {
      enabled,
      refetchOnMount: false,
      placeholderData: generateListStub<'core:address_tokens'>(ADDRESS_TOKEN_BALANCE_ERC_20, 10, { next_page_params: null }),
    },
  });

  const onTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    query.onFilterChange({ type: value });
    setTokenTypes(value);
  }, [ query ]);

  return React.useMemo(() => {
    return {
      query,
      tokenTypes,
      onTokenTypesChange,
    };
  }, [ query, tokenTypes, onTokenTypesChange ]);
}
