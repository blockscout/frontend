// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text, Flex, HStack, VStack, Separator, Box, chakra } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import AdBanner from 'src/features/ads/banner/components/AdBanner';
import AddressMultichainButton from 'src/features/multichain-button/pages/address/AddressMultichainButton';

import config from 'src/config';
import * as mixpanel from 'src/services/mixpanel';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'src/shared/values/entity/utils';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import { formatPercentage } from './utils';

const multichainBalanceFeature = config.features.multichainButton;

const TOP_TOKENS_COLORS = [
  [ 'purple.300', 'pink.300', 'blackAlpha.300' ],
  [ 'purple.500', 'pink.600', 'whiteAlpha.300' ],
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
  isLoading: boolean;
  topTokens?: Array<{ symbol: string; share: number }>;
}

const MultichainAddressPortfolioNetWorth = ({ addressHash, netWorth, isLoading, topTokens }: Props) => {
  const isMobile = useIsMobile();

  const handleMultichainClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Multichain', Source: 'address' });
  }, []);

  const topTokensContent = (() => {
    if (!topTokens) {
      return (
        <chakra.span color="text.secondary">There are no tokens at this address</chakra.span>
      );
    }

    return (
      <>
        <Skeleton loading={ isLoading } w={{ base: '100%', lg: '225px' }} h={ 3 } display="flex" alignItems="center" borderRadius="full" overflow="hidden">
          { topTokens.map((token, index) => (
            <Box
              key={ token.symbol }
              h="100%"
              w={ `${ token.share * 100 }%` }
              bgColor={ getBgColor(token.symbol === 'Others' ? 2 : index) }
              minW="1px"
            />
          )) }
        </Skeleton>
        <HStack flexWrap="wrap">
          { topTokens.map((token, index) => (
            <HStack key={ token.symbol }>
              <Skeleton
                boxSize={ 4 }
                borderRadius="full"
                loading={ isLoading }
                bgColor={ !isLoading ? getBgColor(token.symbol === 'Others' ? 2 : index) : undefined }
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
          <HStack alignItems="center" flexWrap="wrap" gap={ 3 }>
            <HStack w={{ base: 'full', lg: 'auto' }}>
              <SpriteIcon name="wallet" boxSize={ 5 } flexShrink={ 0 } color="icon.primary"/>
              <Text fontWeight={ 500 }>
                Total net worth
                <chakra.span color="text.secondary"> (without NFT)</chakra.span>
              </Text>
            </HStack>
            <SimpleValue
              value={ BigNumber(netWorth ?? 0) }
              prefix="$"
              loading={ isLoading }
              fontWeight={ 600 }
              accuracy={ DEFAULT_ACCURACY_USD }
              color={ !netWorth ? 'text.secondary' : undefined }
            />
            { multichainBalanceFeature.isEnabled && (
              <>
                <Separator height="16px" orientation="vertical"/>
                <HStack gap={ 1 } flexWrap="wrap">
                  { multichainBalanceFeature.providers.map((item) => (
                    <AddressMultichainButton
                      key={ item.name }
                      item={ item }
                      addressHash={ addressHash }
                      onClick={ handleMultichainClick }
                    />
                  )) }
                </HStack>
              </>
            ) }
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
      { !isMobile && <AdBanner format="mobile" w="fit-content"/> }
    </HStack>
  );
};

export default React.memo(MultichainAddressPortfolioNetWorth);
