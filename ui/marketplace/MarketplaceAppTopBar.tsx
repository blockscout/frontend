import { chakra, Flex, Tooltip, Skeleton, Box } from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import { route } from 'nextjs-routes';

import { useAppContext } from 'lib/contexts/app';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

import MarketplaceAppInfo from './MarketplaceAppInfo';

type Props = {
  isWalletConnected: boolean;
  data: MarketplaceAppOverview | undefined;
  isPending: boolean;
}

const MarketplaceAppTopBar = ({ data, isPending, isWalletConnected }: Props) => {
  const appProps = useAppContext();

  const goBackUrl = React.useMemo(() => {
    if (appProps.referrer && appProps.referrer.includes('/apps') && !appProps.referrer.includes('/apps/')) {
      return appProps.referrer;
    }
    return route({ pathname: '/apps' });
  }, [ appProps.referrer ]);

  const message = React.useMemo(() => {
    let icon: IconName = 'wallet';
    let iconColor = 'blackAlpha.800';
    let bgColor = 'orange.100';
    let text = 'Connect your wallet to Blockscout for full-featured access';

    if (isWalletConnected && data?.internalWallet) {
      icon = 'integration/full';
      iconColor = 'green.600';
      bgColor = 'green.100';
      text = 'Your wallet is connected with Blockscout';
    } else if (isWalletConnected) {
      icon = 'integration/partial';
      text = 'Connect your wallet in the app below';
    }

    return { icon, iconColor, bgColor, text };
  }, [ isWalletConnected, data?.internalWallet ]);

  if (isPending) {
    return (
      <Flex alignItems="center" mb={ 2 } gap={ 2 }>
        <Skeleton w="25px" h="32px" borderRadius="base"/>
        <Skeleton w="300px" h="32px" borderRadius="base"/>
        <Skeleton w="75px" h="32px" borderRadius="base"/>
        <Skeleton w="150px" h="32px" borderRadius="base"/>
      </Flex>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Flex alignItems="center" flexWrap="wrap" mb={{ base: 6, md: 2 }} rowGap={ 3 } columnGap={ 2 }>
      <Tooltip label="Back to dApps list" order={ 1 }>
        <LinkInternal display="inline-flex" href={ goBackUrl } h="32px" mr={{ base: 'auto', md: 0 }}>
          <IconSvg name="arrows/east" boxSize={ 6 } transform="rotate(180deg)" margin="auto" color="gray.400"/>
        </LinkInternal>
      </Tooltip>
      <Flex
        flex={{ base: 1, md: 'none' }}
        alignItems="center"
        bgColor={ message.bgColor }
        color="gray.700"
        minHeight={ 8 }
        borderRadius="base"
        px={ 3 }
        py={{ base: 3, md: 1.5 }}
        order={{ base: 4, md: 2 }}
      >
        <IconSvg name={ message.icon } color={ message.iconColor } boxSize={ 5 } flexShrink={ 0 }/>
        <chakra.span ml={ 2 } fontSize="sm" lineHeight={ 5 }>{ message.text }</chakra.span>
      </Flex>
      <Box order={{ base: 2, md: 3 }}>
        <MarketplaceAppInfo data={ data }/>
      </Box>
      <LinkExternal
        order={{ base: 3, md: 4 }}
        href={ data.url }
        variant="subtle"
        fontSize="sm"
        lineHeight={ 5 }
        minW={ 0 }
        maxW={{ base: 'calc(100% - 114px)', md: 'auto' }}
        display="flex"
      >
        <chakra.span isTruncated>{ (new URL(data.url)).hostname }</chakra.span>
      </LinkExternal>
    </Flex>
  );
};

export default MarketplaceAppTopBar;
