import { chakra, Flex, Tooltip, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import { route } from 'nextjs-routes';

import { useAppContext } from 'lib/contexts/app';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

import MarketplaceAppAlert from './MarketplaceAppAlert';
import MarketplaceAppInfo from './MarketplaceAppInfo';

type Props = {
  data: MarketplaceAppOverview | undefined;
  isLoading: boolean;
  isWalletConnected: boolean;
}

const MarketplaceAppTopBar = ({ data, isLoading, isWalletConnected }: Props) => {
  const appProps = useAppContext();

  const goBackUrl = React.useMemo(() => {
    if (appProps.referrer && appProps.referrer.includes('/apps') && !appProps.referrer.includes('/apps/')) {
      return appProps.referrer;
    }
    return route({ pathname: '/apps' });
  }, [ appProps.referrer ]);

  function getHostname(url: string | undefined) {
    try {
      return new URL(url || '').hostname;
    } catch (err) {}
  }

  return (
    <Flex alignItems="center" flexWrap="wrap" mb={{ base: 6, md: 2 }} rowGap={ 3 } columnGap={ 2 }>
      <Tooltip label="Back to dApps list" order={ 1 }>
        <LinkInternal display="inline-flex" href={ goBackUrl } h="32px" isLoading={ isLoading }>
          <IconSvg name="arrows/east" boxSize={ 6 } transform="rotate(180deg)" margin="auto" color="gray.400"/>
        </LinkInternal>
      </Tooltip>
      <Skeleton width={{ base: '100%', md: 'auto' }} order={{ base: 4, md: 2 }} isLoaded={ !isLoading }>
        <MarketplaceAppAlert internalWallet={ data?.internalWallet } isWalletConnected={ isWalletConnected }/>
      </Skeleton>
      <Skeleton order={{ base: 2, md: 3 }} isLoaded={ !isLoading }>
        <MarketplaceAppInfo data={ data }/>
      </Skeleton>
      <LinkExternal
        order={{ base: 3, md: 4 }}
        href={ data?.url }
        variant="subtle"
        fontSize="sm"
        lineHeight={ 5 }
        minW={ 0 }
        maxW={{ base: 'calc(100% - 114px)', md: 'auto' }}
        display="flex"
        isLoading={ isLoading }
      >
        <chakra.span isTruncated>
          { getHostname(data?.url) }
        </chakra.span>
      </LinkExternal>
    </Flex>
  );
};

export default MarketplaceAppTopBar;
