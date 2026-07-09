// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import type { schemas } from '@blockscout/api-types';
import { isConfidentialTokenType } from 'src/slices/token/utils/token-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import type { TokenTabs } from 'src/slices/token/pages/details/Token';

import Address3rdPartyWidgets from 'src/features/address-3rd-party-widgets/pages/address/Address3rdPartyWidgets';
import AppActionButton from 'src/features/address-metadata/components/AppActionButton';
import useAppActionData from 'src/features/address-metadata/hooks/useAppActionData';
import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoSponsoredItem from 'src/shared/detailed-info/DetailedInfoSponsoredItem';
import useIsMounted from 'src/shared/hooks/useIsMounted';
import AssetValue from 'src/shared/values/entity/AssetValue';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TokenNftMarketplaces from './TokenNftMarketplaces';

interface Props {
  data: schemas['Token'] | undefined;
  counters: schemas['TokenCountersResponse'] | undefined;
  isLoading: boolean;
  isLoadingCounters: boolean;
  address3rdPartyWidgets?: Array<string>;
}

const TokenDetails = ({ data, counters, isLoading, isLoadingCounters, address3rdPartyWidgets }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const hash = router.query.hash?.toString();

  const multichainContext = useMultichainContext();
  const chainSlug = multichainContext?.chain?.slug;

  const appActionData = useAppActionData(hash);

  const changeTab = useCallback((tab: TokenTabs) => () => {
    router.push(
      chainSlug ?
        { pathname: '/chain/[chain_slug_or_id]/token/[hash]', query: { hash: hash || '', tab, chain_slug_or_id: chainSlug } } :
        { pathname: '/token/[hash]', query: { hash: hash || '', tab } },
      undefined,
      { shallow: true },
    );
  }, [ chainSlug, hash, router ]);

  const countersItem = useCallback((item: 'token_holders_count' | 'transfers_count') => {
    const itemValue = counters?.[item];
    if (!itemValue) {
      return 'N/A';
    }
    if (itemValue === '0') {
      return itemValue;
    }

    const tab: TokenTabs = item === 'token_holders_count' ? 'holders' : 'token_transfers';

    return (
      <Link onClick={ changeTab(tab) } loading={ isLoadingCounters }>
        { Number(itemValue).toLocaleString() }
      </Link>
    );
  }, [ counters, isLoadingCounters, changeTab ]);

  if (!isMounted) {
    return null;
  }

  const {
    exchange_rate: exchangeRate,
    total_supply: totalSupply,
    circulating_market_cap: marketCap,
    circulating_supply: circulatingSupply,
    decimals,
    symbol,
    type,
    zilliqa,
  } = data || {};

  return (
    <DetailedInfo.Container>
      { zilliqa?.zrc2_address_hash && (
        <>
          <DetailedInfo.ItemLabel
            hint="ZRC-2 address of the token"
            isLoading={ isLoading }
          >
            ZRC-2 Address
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading } display="inline-block">
              <AddressEntity address={{ hash: zilliqa.zrc2_address_hash }} isLoading={ isLoading }/>
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { exchangeRate && (
        <>
          <DetailedInfo.ItemLabel
            hint="Price per token on the exchanges"
            isLoading={ isLoading }
          >
            Price
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading } display="inline-block">
              <span>{ `$${ Number(exchangeRate).toLocaleString(undefined, { minimumSignificantDigits: 4 }) }` }</span>
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { marketCap && (
        <>
          <DetailedInfo.ItemLabel
            hint="Circulating supply * Price"
            isLoading={ isLoading }
          >
            Circulating market cap
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading } display="inline-block">
              <span>{ `$${ BigNumber(marketCap).toFormat() }` }</span>
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { circulatingSupply && (
        <>
          <DetailedInfo.ItemLabel
            hint="Number of publicly available tokens"
            isLoading={ isLoading }
          >
            Circulating supply
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
            alignSelf="center"
            wordBreak="break-word"
            whiteSpace="pre-wrap"
          >
            <AssetValue
              amount={ circulatingSupply }
              asset={ <chakra.span maxW="50%" overflow="hidden" textOverflow="ellipsis"> { symbol }</chakra.span> }
              accuracy={ 3 }
              decimals={ decimals ?? '0' }
              loading={ isLoading }
              w="100%"
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { type && !isConfidentialTokenType(type) && (
        <>
          <DetailedInfo.ItemLabel
            hint="The total amount of tokens issued"
            isLoading={ isLoading }
          >
            Total supply
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
            alignSelf="center"
            wordBreak="break-word"
            whiteSpace="pre-wrap"
          >
            <AssetValue
              amount={ totalSupply }
              asset={ <chakra.span maxW="50%" overflow="hidden" textOverflow="ellipsis"> { symbol }</chakra.span> }
              accuracy={ 3 }
              decimals={ decimals ?? '0' }
              loading={ isLoading }
              w="100%"
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint="Number of accounts holding the token"
        isLoading={ isLoading }
      >
        Holders
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading || isLoadingCounters }>
          { countersItem('token_holders_count') }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Number of transfer for the token"
        isLoading={ isLoading }
      >
        Transfers
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading || isLoadingCounters }>
          { countersItem('transfers_count') }
        </Skeleton>
      </DetailedInfo.ItemValue>

      { decimals && (
        <>
          <DetailedInfo.ItemLabel
            hint="Number of digits that come after the decimal place when displaying token value"
            isLoading={ isLoading }
          >
            Decimals
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading } minW={ 6 }>
              { decimals }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { type !== 'ERC-20' && (
        <TokenNftMarketplaces
          hash={ hash }
          isLoading={ isLoading }
          appActionData={ appActionData }
          source="NFT collection"
        />
      ) }

      { (type !== 'ERC-20' && config.slices.token.nft.marketplaces.length === 0 && appActionData) && (
        <>
          <DetailedInfo.ItemLabel
            hint="Link to the dapp"
          >
            Dapp
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
            py="1px"
          >
            <AppActionButton data={ appActionData } height="30px" source="NFT collection"/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfoSponsoredItem isLoading={ isLoading }/>

      { ((address3rdPartyWidgets ?? []).length > 0) && (
        <>
          <DetailedInfo.ItemLabel
            hint="Metrics provided by third party partners"
            isLoading={ isLoading }
          >
            Widgets
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Address3rdPartyWidgets
              addressType="token"
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }
    </DetailedInfo.Container>
  );
};

export default React.memo(TokenDetails);
