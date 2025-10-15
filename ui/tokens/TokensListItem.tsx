import { Flex, HStack, Grid, GridItem } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenInfo } from 'types/api/token';
import type { AggregatedTokenInfo } from 'types/client/multichain-aggregator';

import config from 'configs/app';
import multichainConfig from 'configs/multichain';
import getItemIndex from 'lib/getItemIndex';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  token: TokenInfo | AggregatedTokenInfo;
  index: number;
  page: number;
  isLoading?: boolean;
};

const bridgedTokensFeature = config.features.bridgedTokens;

const TokensListItem = ({
  token,
  page,
  index,
  isLoading,
}: Props) => {

  const {
    address_hash: addressHash,
    exchange_rate: exchangeRate,
    type,
    holders_count: holdersCount,
    circulating_market_cap: marketCap,
  } = token;

  const originalChainId = 'origin_chain_id' in token ? token.origin_chain_id : undefined;
  const chainInfos = 'chain_infos' in token ? token.chain_infos : undefined;

  const bridgedChainTag = bridgedTokensFeature.isEnabled ?
    bridgedTokensFeature.chains.find(({ id }) => id === originalChainId)?.short_title :
    undefined;

  const filecoinRobustAddress = 'filecoin_robust_address' in token ? token.filecoin_robust_address : undefined;

  const chainInfo = React.useMemo(() => {
    if (!chainInfos) {
      return;
    }

    const chainId = Object.keys(chainInfos)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.config.chain.id === chainId);
    return chain;
  }, [ chainInfos ]);

  return (
    <ListItemMobile rowGap={ 3 }>
      <Grid
        width="100%"
        gridTemplateColumns="minmax(0, 1fr)"
      >
        <GridItem display="flex">
          <TokenEntity
            token={ token }
            chain={ chainInfo }
            isLoading={ isLoading }
            jointSymbol
            noCopy
            w="auto"
            textStyle="sm"
            fontWeight="700"
          />
          <Flex ml={ 3 } flexShrink={ 0 } columnGap={ 1 }>
            <Tag loading={ isLoading }>{ getTokenTypeName(type) }</Tag>
            { bridgedChainTag && <Tag loading={ isLoading }>{ bridgedChainTag }</Tag> }
          </Flex>
          <Skeleton loading={ isLoading } textStyle="sm" ml="auto" color="text.secondary" minW="24px" textAlign="right">
            <span>{ getItemIndex(index, page) }</span>
          </Skeleton>
        </GridItem>
      </Grid>
      <Flex justifyContent="space-between" alignItems="center" width="150px" ml={ 7 } mt={ -2 }>
        <AddressEntity
          address={{ hash: addressHash, filecoin: { robust: filecoinRobustAddress } }}
          isLoading={ isLoading }
          truncation="constant"
          linkVariant="secondary"
          noIcon
        />
        <AddressAddToWallet token={ token } isLoading={ isLoading }/>
      </Flex>
      { exchangeRate && (
        <HStack gap={ 3 }>
          <Skeleton loading={ isLoading } textStyle="sm" fontWeight={ 500 }>Price</Skeleton>
          <Skeleton loading={ isLoading } textStyle="sm" color="text.secondary">
            <span>${ Number(exchangeRate).toLocaleString(undefined, { minimumSignificantDigits: 4 }) }</span>
          </Skeleton>
        </HStack>
      ) }
      { marketCap && (
        <HStack gap={ 3 }>
          <Skeleton loading={ isLoading } textStyle="sm" fontWeight={ 500 }>On-chain market cap</Skeleton>
          <Skeleton loading={ isLoading } textStyle="sm" color="text.secondary"><span>{ BigNumber(marketCap).toFormat() }</span></Skeleton>
        </HStack>
      ) }
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } textStyle="sm" fontWeight={ 500 }>Holders</Skeleton>
        <Skeleton loading={ isLoading } textStyle="sm" color="text.secondary"><span>{ Number(holdersCount).toLocaleString() }</span></Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default TokensListItem;
