import { Flex, HStack, Grid, GridItem, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  token: TokenInfo;
  index: number;
  page: number;
  isLoading?: boolean;
}

const PAGE_SIZE = 50;

const bridgedTokensFeature = config.features.bridgedTokens;

const TokensTableItem = ({
  token,
  page,
  index,
  isLoading,
}: Props) => {

  const {
    address,
    exchange_rate: exchangeRate,
    type,
    holders,
    circulating_market_cap: marketCap,
    origin_chain_id: originalChainId,
  } = token;

  const bridgedChainTag = bridgedTokensFeature.isEnabled ?
    bridgedTokensFeature.chains.find(({ id }) => id === originalChainId)?.short_title :
    undefined;

  return (
    <ListItemMobile rowGap={ 3 }>
      <Grid
        width="100%"
        gridTemplateColumns="minmax(0, 1fr)"
      >
        <GridItem display="flex">
          <TokenEntity
            token={ token }
            isLoading={ isLoading }
            jointSymbol
            noCopy
            w="auto"
            fontSize="sm"
            fontWeight="700"
          />
          <Flex ml={ 3 } flexShrink={ 0 } columnGap={ 1 }>
            <Tag isLoading={ isLoading }>{ type }</Tag>
            { bridgedChainTag && <Tag isLoading={ isLoading }>{ bridgedChainTag }</Tag> }
          </Flex>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" ml="auto" color="text_secondary" minW="24px" textAlign="right" lineHeight={ 6 }>
            <span>{ (page - 1) * PAGE_SIZE + index + 1 }</span>
          </Skeleton>
        </GridItem>
      </Grid>
      <Flex justifyContent="space-between" alignItems="center" width="150px" ml={ 7 } mt={ -2 }>
        <AddressEntity
          address={{ hash: address }}
          isLoading={ isLoading }
          truncation="constant"
          noIcon
        />
        <AddressAddToWallet token={ token } isLoading={ isLoading }/>
      </Flex>
      { exchangeRate && (
        <HStack spacing={ 3 }>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Price</Skeleton>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary">
            <span>${ Number(exchangeRate).toLocaleString(undefined, { minimumSignificantDigits: 4 }) }</span>
          </Skeleton>
        </HStack>
      ) }
      { marketCap && (
        <HStack spacing={ 3 }>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>On-chain market cap</Skeleton>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary"><span>{ BigNumber(marketCap).toFormat() }</span></Skeleton>
        </HStack>
      ) }
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Holders</Skeleton>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary"><span>{ Number(holders).toLocaleString() }</span></Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default TokensTableItem;
