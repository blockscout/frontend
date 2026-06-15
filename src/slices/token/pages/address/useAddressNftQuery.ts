// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { NftTokenType } from 'src/slices/token/types/api';
import { NFT_TOKEN_TYPE_IDS } from 'src/slices/token/utils/token-types';

import { useAppContext } from 'src/shell/app/context';

import { ADDRESS_COLLECTION, ADDRESS_NFT_1155 } from 'src/slices/address/stubs/address';

import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getFilterValuesFromQuery from 'src/shared/router/get-filter-values-from-query';
import * as cookies from 'src/shared/storage/cookies';

const getTokenFilterValue: (type: string | Array<string> | undefined) => Array<NftTokenType> | undefined =
(getFilterValuesFromQuery<NftTokenType>).bind(null, NFT_TOKEN_TYPE_IDS);

export type TNftDisplayType = 'collection' | 'list';

interface Props {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  enabled?: boolean;
  addressHash: string;
  isMultichain?: boolean;
  chainIds?: Array<string>;
}

export default function useAddressNftQuery({ scrollRef, enabled = true, addressHash, isMultichain, chainIds }: Props) {
  const router = useRouter();

  const displayTypeCookie = cookies.get(cookies.NAMES.ADDRESS_NFT_DISPLAY_TYPE, useAppContext().cookies);
  const [ displayType, setDisplayType ] = React.useState<TNftDisplayType>(displayTypeCookie === 'list' ? 'list' : 'collection');
  const [ tokenTypes, setTokenTypes ] = React.useState<Array<NftTokenType> | undefined>(getTokenFilterValue(router.query.type) || []);

  const collectionsQuery = useQueryWithPages({
    resourceName: 'core:address_collections',
    pathParams: { hash: addressHash },
    scrollRef,
    options: {
      enabled: enabled && displayType === 'collection',
      placeholderData: generateListStub<'core:address_collections'>(ADDRESS_COLLECTION, 10, { next_page_params: null }),
    },
    filters: { type: tokenTypes },
    isMultichain,
    chainIds,
  });

  const nftsQuery = useQueryWithPages({
    resourceName: 'core:address_nfts',
    pathParams: { hash: addressHash },
    scrollRef,
    options: {
      enabled: enabled && displayType === 'list',
      placeholderData: generateListStub<'core:address_nfts'>(ADDRESS_NFT_1155, 10, { next_page_params: null }),
    },
    filters: { type: tokenTypes },
    isMultichain,
    chainIds,
  });

  const onDisplayTypeChange = React.useCallback((val: string) => {
    cookies.set(cookies.NAMES.ADDRESS_NFT_DISPLAY_TYPE, val);
    setDisplayType(val as TNftDisplayType);
  }, []);

  const onTokenTypesChange = React.useCallback((value: Array<NftTokenType>) => {
    nftsQuery.onFilterChange({ type: value });
    collectionsQuery.onFilterChange({ type: value });
    setTokenTypes(value);
  }, [ nftsQuery, collectionsQuery ]);

  return React.useMemo(() => ({
    nftsQuery,
    collectionsQuery,
    displayType,
    tokenTypes,
    onDisplayTypeChange,
    onTokenTypesChange,
  }), [ nftsQuery, collectionsQuery, displayType, tokenTypes, onDisplayTypeChange, onTokenTypesChange ]);
}
