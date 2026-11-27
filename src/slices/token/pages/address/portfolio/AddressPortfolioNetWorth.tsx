// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack, VStack, Box, chakra } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import AdBanner from 'src/features/ads/banner/components/AdBanner';
import AddressMultichainButtons from 'src/features/multichain-button/pages/address/AddressMultichainButtons';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'src/shared/values/entity/utils';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import type { TopToken } from './utils';
import { formatPercentage, OTHERS_SYMBOL } from './utils';

const TOP_TOKENS_COLORS = [
  [ 'purple.300', 'pink.300', 'blackAlpha.300' ],
  [ 'purple.500', 'pink.600', 'whiteAlpha.300' ],
];

const LOADING_TOP_TOKENS: ReadonlyArray<TopToken> = [
  { symbol: 'Token 1', share: 0.5 },
  { symbol: 'Token 2', share: 0.3 },
  { symbol: OTHERS_SYMBOL, share: 0.2 },
];

const getBgColor = (index: number) => {
  return {
    _light: TOP_TOKENS_COLORS[0][index],
    _dark: TOP_TOKENS_COLORS[1][index],
  };
};

interface Props {
  addressHash: string;
  netWorth?: string;
  isOverflow?: boolean;
  isLoading: boolean;
  topTokens?: ReadonlyArray<TopToken>;
  hasAdBanner?: boolean;
  hasMultichainButtons?: boolean;
  children?: React.ReactNode;
}

const AddressPortfolioNetWorth = ({
  addressHash, netWorth, isOverflow, isLoading, topTokens, hasAdBanner, hasMultichainButtons, children,
}: Props) => {
  const isMobile = useIsMobile();

  const topTokensContent = (() => {
    if (!topTokens && !isLoading) {
      return (
        <chakra.span color="text.secondary">There are no tokens at this address</chakra.span>
      );
    }

    const items = topTokens ?? LOADING_TOP_TOKENS;

    return (
      <>
        <Skeleton loading={ isLoading } w={{ base: '100%', lg: '225px' }} h={ 3 } display="flex" alignItems="center" borderRadius="full" overflow="hidden">
          { items.map((token, index) => (
            <Box
              key={ token.symbol }
              h="100%"
              w={ `${ token.share * 100 }%` }
              bgColor={ getBgColor(token.symbol === OTHERS_SYMBOL ? 2 : index) }
              minW="1px"
            />
          )) }
        </Skeleton>
        <HStack flexWrap="wrap" columnGap={ 3 }>
          { items.map((token, index) => (
            <HStack key={ token.symbol }>
              <Skeleton
                boxSize={ 4 }
                borderRadius="full"
                loading={ isLoading }
                bgColor={ !isLoading ? getBgColor(token.symbol === OTHERS_SYMBOL ? 2 : index) : undefined }
              />
              <Skeleton loading={ isLoading } fontWeight={ 600 } whiteSpace="pre">
                <span>{ token.symbol }</span>
                <chakra.span color="text.secondary"> { formatPercentage(token.share) }</chakra.span>
              </Skeleton>
            </HStack>
          )) }
        </HStack>
      </>
    );

  })();

  return (
    <HStack alignItems="flex-start" w="full">
      <VStack
        flexGrow={ 1 }
        borderRadius="base"
        overflow="hidden"
        alignSelf="stretch"
        rowGap="1px"
        minH="100px"
      >
        <Flex
          bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}
          flexBasis="50%"
          w="full"
          p={ 3 }
          whiteSpace="pre"
          textStyle="sm"
          alignItems="center"
        >
          <HStack alignItems="center" flexWrap="wrap" columnGap={ 3 } rowGap={{ base: 3, lg: 2 }} maxW="100%">
            <HStack w={{ base: 'full', lg: 'auto' }} display="flex" minH={{ base: 'auto', lg: '32px' }}>
              <SpriteIcon name="wallet" boxSize={ 5 } flexShrink={ 0 } color="icon.primary"/>
              <span>Total net worth (without NFT)</span>
              <SimpleValue
                value={ BigNumber(netWorth ?? 0) }
                prefix="$"
                loading={ isLoading }
                fontWeight={ 600 }
                accuracy={ DEFAULT_ACCURACY_USD }
                overflowed={ isOverflow }
                color={ !netWorth ? 'text.secondary' : undefined }
              />
            </HStack>
            { children }
            { hasMultichainButtons && <AddressMultichainButtons addressHash={ addressHash }/> }
          </HStack>
        </Flex>
        <Flex
          alignItems={{ base: 'flex-start', lg: 'center' }}
          bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}
          flexBasis="50%"
          w="full"
          p={ 3 }
          gap={ 3 }
          flexDirection={{ base: 'column', lg: 'row' }}
          textStyle="xs"
        >
          { topTokensContent }
        </Flex>
      </VStack>
      { hasAdBanner && !isMobile && <AdBanner format="mobile" w="fit-content"/> }
    </HStack>
  );
};

export default React.memo(AddressPortfolioNetWorth);
