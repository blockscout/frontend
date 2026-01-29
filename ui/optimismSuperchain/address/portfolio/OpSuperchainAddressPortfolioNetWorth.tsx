import { Text, Flex, HStack, VStack, Separator, Box, Circle, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel';
import AddressMultichainButton from 'ui/address/details/AddressMultichainButton';
import AdBanner from 'ui/shared/ad/AdBanner';
import IconSvg from 'ui/shared/IconSvg';

import { formatPercentage } from './utils';

const multichainBalanceFeature = config.features.multichainButton;

const TOP_TOKENS = [
  { symbol: 'USDT', share: 0.6 },
  { symbol: 'ETH', share: 0.399 },
  { symbol: 'Other', share: 0.001 },
];
const TOP_TOKENS_COLORS = [ 'purple.300', 'pink.300', '#D9D9D9' ];

interface Props {
  addressHash: string;
}

const OpSuperchainAddressPortfolioNetWorth = ({ addressHash }: Props) => {
  const isMobile = useIsMobile();

  const handleMultichainClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Multichain', Source: 'address' });
  }, []);

  return (
    <HStack alignItems="center" w="full" h={{ base: 'auto', lg: '100px' }}>
      <VStack
        flexGrow={ 1 }
        borderRadius="base"
        overflow="hidden"
        h="100%"
        rowGap="1px"
      >
        <Flex
          alignItems={{ base: 'flex-start', lg: 'center' }}
          bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}
          flexBasis="50%"
          w="full"
          p={ 3 }
          gap={ 3 }
          whiteSpace="pre"
          flexDirection={{ base: 'column', lg: 'row' }}
          textStyle="sm"
        >
          <Flex alignItems="center">
            <IconSvg name="wallet" boxSize={ 5 } flexShrink={ 0 } color="icon.primary"/>
            <Text ml={ 2 } fontWeight={ 500 }>Total net worth</Text>
            <Text color="text.secondary"> (without NFT)</Text>
          </Flex>
          <Flex >
            <Text fontWeight={ 600 }>$6,170,337.69</Text>
            { multichainBalanceFeature.isEnabled && (
              <>
                <Separator mx={ 3 } height="16px" orientation="vertical"/>
                <HStack gap={ 3 }>
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
          </Flex>
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
          <Flex w="225px" h={ 3 } borderRadius="full" overflow="hidden">
            { TOP_TOKENS.map((token, index) => (
              <Box key={ token.symbol } h="100%" w={ `${ token.share * 100 }%` } bgColor={ TOP_TOKENS_COLORS[index] } minW="1px"/>
            )) }
          </Flex>
          <HStack flexWrap="wrap">
            { TOP_TOKENS.map((token, index) => (
              <HStack key={ token.symbol }>
                <Circle size={ 4 } bgColor={ TOP_TOKENS_COLORS[index] }/>
                <Text fontWeight={ 600 } whiteSpace="pre">
                  <span>{ token.symbol }</span>
                  <chakra.span color="text.secondary"> { formatPercentage(token.share) }</chakra.span>
                </Text>
              </HStack>
            )) }
          </HStack>
        </Flex>
      </VStack>
      { !isMobile && <AdBanner format="mobile" w="fit-content"/> }
    </HStack>
  );
};

export default React.memo(OpSuperchainAddressPortfolioNetWorth);
