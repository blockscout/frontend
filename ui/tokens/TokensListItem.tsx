import { Flex, HStack, Grid, GridItem, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressLink from 'ui/shared/address/AddressLink';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TokenLogo from 'ui/shared/TokenLogo';

type Props = {
  token: TokenInfo;
  index: number;
  page: number;
  isLoading?: boolean;
}

const PAGE_SIZE = 50;

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
    name,
    symbol,
    holders,
    circulating_market_cap: marketCap,
  } = token;

  const tokenString = [ name, symbol && `(${ symbol })` ].filter(Boolean).join(' ');

  return (
    <ListItemMobile rowGap={ 3 }>
      <Grid
        width="100%"
        gridTemplateColumns="minmax(0, 1fr)"
      >
        <GridItem display="flex">
          <Flex overflow="hidden" mr={ 3 } alignItems="center">
            <TokenLogo data={ token } boxSize={ 6 } mr={ 2 } isLoading={ isLoading }/>
            <AddressLink fontSize="sm" fontWeight="700" hash={ address } type="token" alias={ tokenString } isLoading={ isLoading } mr={ 3 }/>
            <Tag flexShrink={ 0 } isLoading={ isLoading }>{ type }</Tag>
          </Flex>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" ml="auto" color="text_secondary" minW="24px" textAlign="right" lineHeight={ 6 }>
            <span>{ (page - 1) * PAGE_SIZE + index + 1 }</span>
          </Skeleton>
        </GridItem>
      </Grid>
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Flex alignItems="center" width="136px" justifyContent="space-between" ml={ 8 } mt="-8px">
          <Flex alignItems="center">
            <AddressLink fontSize="sm" hash={ address } type="address" truncation="constant" isLoading={ isLoading }/>
            <CopyToClipboard text={ address } isLoading={ isLoading }/>
          </Flex>
          <AddressAddToWallet token={ token } isLoading={ isLoading }/>
        </Flex>
      </Flex>
      { exchangeRate && (
        <HStack spacing={ 3 }>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" fontWeight={ 500 }>Price</Skeleton>
          <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary"><span>{ exchangeRate }</span></Skeleton>
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
