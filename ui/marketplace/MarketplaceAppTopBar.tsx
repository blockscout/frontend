import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceAppOverview, MarketplaceAppSecurityReport, ContractListTypes } from 'types/client/marketplace';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import { Link } from 'toolkit/chakra/link';
import { BackToButton } from 'toolkit/components/buttons/BackToButton';
import { makePrettyLink } from 'toolkit/utils/url';
import RewardsButton from 'ui/rewards/RewardsButton';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import UserProfileDesktop from 'ui/snippets/user/profile/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

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
};

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

  const showContractList = React.useCallback((id: string, type: ContractListTypes) => setContractListType(type), []);
  const hideContractList = React.useCallback(() => setContractListType(undefined), []);

  const handleBackToClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Back to', Source: mixpanel.PAGE_TYPE_DICT['/apps/[id]'] });
  }, []);

  return (
    <>
      <Flex alignItems="center" mb={{ base: 3, md: 2 }} rowGap={ 3 } columnGap={ 2 }>
        { !isMobile && <NetworkLogo isCollapsed mr={ 4 }/> }
        <BackToButton
          href={ goBackUrl }
          hint="Back to dApps list"
          loading={ isLoading }
          onClick={ handleBackToClick }
        />
        <Link
          external
          href={ data?.url }
          variant="underlaid"
          textStyle="sm"
          minW={ 0 }
          maxW={{ base: 'calc(100% - 114px)', md: 'auto' }}
          display="flex"
          loading={ isLoading }
        >
          <chakra.span truncate>
            { makePrettyLink(data?.url)?.domain }
          </chakra.span>
        </Link>
        <MarketplaceAppInfo data={ data } isLoading={ isLoading }/>
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
          <Flex ml="auto" gap={ 2 }>
            { config.features.rewards.isEnabled && <RewardsButton size="sm"/> }
            {
              (config.features.account.isEnabled && <UserProfileDesktop buttonSize="sm"/>) ||
              (config.features.blockchainInteraction.isEnabled && <UserWalletDesktop buttonSize="sm"/>)
            }
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
