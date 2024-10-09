import { chakra, Flex, Tooltip, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceAppOverview, MarketplaceAppSecurityReport, ContractListTypes } from 'types/client/marketplace';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';
import LinkInternal from 'ui/shared/links/LinkInternal';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import WalletMenuDesktop from 'ui/snippets/walletMenu/WalletMenuDesktop';

import AppSecurityReport from './AppSecurityReport';
import ContractListModal from './ContractListModal';
import MarketplaceAppInfo from './MarketplaceAppInfo';
import Rating from './Rating/Rating';
import useRatings from './Rating/useRatings';

type Props = {
  appId: string;
  data: MarketplaceAppOverview | undefined;
  isLoading: boolean;
  securityReport?: MarketplaceAppSecurityReport;
}

const MarketplaceAppTopBar = ({ appId, data, isLoading, securityReport }: Props) => {
  const [ contractListType, setContractListType ] = React.useState<ContractListTypes>();
  const appProps = useAppContext();
  const isMobile = useIsMobile();

  const { ratings, userRatings, rateApp, isRatingSending, isRatingLoading, canRate } = useRatings();

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

  const showContractList = React.useCallback((id: string, type: ContractListTypes) => setContractListType(type), []);
  const hideContractList = React.useCallback(() => setContractListType(undefined), []);

  return (
    <>
      <Flex alignItems="center" mb={{ base: 3, md: 2 }} rowGap={ 3 } columnGap={ 2 }>
        { !isMobile && <NetworkLogo isCollapsed/> }
        <Tooltip label="Back to dApps list">
          <LinkInternal display="inline-flex" href={ goBackUrl } h="32px" isLoading={ isLoading } ml={ isMobile ? 0 : 4 }>
            <IconSvg name="arrows/east" boxSize={ 6 } transform="rotate(180deg)" margin="auto" color="gray.400"/>
          </LinkInternal>
        </Tooltip>
        <LinkExternal
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
        <Skeleton isLoaded={ !isLoading }>
          <MarketplaceAppInfo data={ data }/>
        </Skeleton>
        { (securityReport || isLoading) && (
          <AppSecurityReport
            id={ data?.id || '' }
            securityReport={ securityReport }
            showContractList={ showContractList }
            isLoading={ isLoading }
            onlyIcon={ isMobile }
            source="App page"
          />
        ) }
        <Rating
          appId={ appId }
          rating={ ratings[appId] }
          userRating={ userRatings[appId] }
          rate={ rateApp }
          isSending={ isRatingSending }
          isLoading={ isRatingLoading }
          canRate={ canRate }
          source="App page"
        />
        { !isMobile && (
          <Flex flex="1" justifyContent="flex-end">
            { config.features.account.isEnabled && <ProfileMenuDesktop boxSize="32px" fallbackIconSize={ 16 }/> }
            { config.features.blockchainInteraction.isEnabled && <WalletMenuDesktop size="sm"/> }
          </Flex>
        ) }
      </Flex>
      { contractListType && (
        <ContractListModal
          type={ contractListType }
          contracts={ securityReport?.contractsData }
          onClose={ hideContractList }
        />
      ) }
    </>
  );
};

export default MarketplaceAppTopBar;
