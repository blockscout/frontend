// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import AddressFungibleTokens from 'src/slices/token/pages/address/fungible/AddressFungibleTokens';
import AddressFungibleTokensNetWorth from 'src/slices/token/pages/address/fungible/AddressFungibleTokensNetWorth';
import AddressNfts from 'src/slices/token/pages/address/nfts/AddressNfts';
import AddressNftsCollections from 'src/slices/token/pages/address/nfts/AddressNftsCollections';
import useAddressFungibleTokensQuery from 'src/slices/token/pages/address/useAddressFungibleTokensQuery';
import useAddressNftQuery from 'src/slices/token/pages/address/useAddressNftQuery';

import AddressMultichainPortfolio from 'src/features/multichain-portfolio/pages/address/AddressMultichainPortfolio';

import config from 'src/config';
import useIsMounted from 'src/shared/hooks/useIsMounted';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { useRouter } from 'src/shared/router/useRouter';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

const hasMultichainPortfolio = config.features.multichainPortfolio.isEnabled;

const FUNGIBLE_TAB_ID = 'tokens_erc20';
const NFT_TAB_ID = 'tokens_nfts';
const MULTICHAIN_PORTFOLIO_TAB_ID = 'tokens_multichain';

export const ADDRESS_TOKENS_TAB_IDS = [
  ...(hasMultichainPortfolio ? [ MULTICHAIN_PORTFOLIO_TAB_ID ] : []),
  FUNGIBLE_TAB_ID,
  NFT_TAB_ID,
  'tokens_nfts_collection',
  'tokens_nfts_list',
];

// The bare `tokens` id opens the first sub-tab, which is the portfolio when the feature is on.
const FUNGIBLE_TAB_IDS = hasMultichainPortfolio ? [ FUNGIBLE_TAB_ID ] : [ 'tokens', FUNGIBLE_TAB_ID ];

const TAB_LIST_PROPS = {
  mb: 3,
};

interface Props {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressTokens = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const tab = getQueryParamString(router.query.tab);
  const hash = getQueryParamString(router.query.hash);

  const { query: fungibleTokensQuery, tokenTypes: fungibleTokenTypes, onTokenTypesChange: handleFungibleTokenTypesChange } = useAddressFungibleTokensQuery({
    addressHash: hash,
    scrollRef,
    enabled: isQueryEnabled && FUNGIBLE_TAB_IDS.includes(tab),
  });

  const { nftsQuery, collectionsQuery, displayType: nftDisplayType, tokenTypes: nftTokenTypes, onDisplayTypeChange, onTokenTypesChange } = useAddressNftQuery({
    scrollRef,
    enabled: isQueryEnabled && tab === NFT_TAB_ID,
    addressHash: hash,
  });

  const nftDisplayTypeSwitch = React.useMemo(() => ({ value: nftDisplayType, onChange: onDisplayTypeChange }), [ nftDisplayType, onDisplayTypeChange ]);

  if (!isMounted || !shouldRender) {
    return null;
  }

  const tabs = [
    hasMultichainPortfolio && {
      id: MULTICHAIN_PORTFOLIO_TAB_ID,
      title: 'Multichain portfolio',
      component: <AddressMultichainPortfolio/>,
    },
    {
      id: FUNGIBLE_TAB_ID,
      title: 'Tokens',
      component: (
        <>
          <Box mb={ 6 }>
            <AddressFungibleTokensNetWorth addressHash={ hash }/>
          </Box>
          <AddressFungibleTokens
            items={ fungibleTokensQuery.data?.items }
            isLoading={ fungibleTokensQuery.isInitialLoading }
            isTransitioning={ fungibleTokensQuery.isTransitioning }
            pagination={ fungibleTokensQuery.pagination }
            isError={ fungibleTokensQuery.isError }
            tokenTypes={ fungibleTokenTypes }
            onTokenTypesChange={ handleFungibleTokenTypesChange }
            resetKey={ fungibleTokensQuery.queryHash }
          />
        </>
      ),
    },
    {
      id: NFT_TAB_ID,
      title: 'NFTs',
      component: nftDisplayType === 'list' ? (
        <AddressNfts
          tokensQuery={ nftsQuery }
          tokenTypes={ nftTokenTypes }
          onTokenTypesChange={ onTokenTypesChange }
          displayTypeSwitch={ nftDisplayTypeSwitch }
        />
      ) : (
        <AddressNftsCollections
          collectionsQuery={ collectionsQuery }
          address={ hash }
          tokenTypes={ nftTokenTypes }
          onTokenTypesChange={ onTokenTypesChange }
          displayTypeSwitch={ nftDisplayTypeSwitch }
        />
      ),
    },
  ].filter(Boolean);

  return (
    <>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>
      <RoutedTabs
        tabs={ tabs }
        variant="secondary"
        size="sm"
        listProps={ TAB_LIST_PROPS }
      />
    </>
  );
};

export default AddressTokens;
