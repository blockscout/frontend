// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { MarketplaceDapp } from '@blockscout/admin-rs-types';

import { useAppContext } from 'src/shell/app/context';

import NetworkIcon from 'src/slices/chain/logo/NetworkIcon';

import UserProfileDesktop from 'src/features/account/components/user-profile/UserProfileDesktop';
import RewardsButton from 'src/features/rewards/components/RewardsButton';

import config from 'src/config';
import * as mixpanel from 'src/services/mixpanel';
import useIsMobile from 'src/shared/hooks/useIsMobile';

import { Link } from 'src/toolkit/chakra/link';
import { BackToButton } from 'src/toolkit/components/buttons/BackToButton';
import { makePrettyLink } from 'src/toolkit/utils/url';

import Rating from '../../components/rating/MarketplaceRating';
import MarketplaceAppInfo from './info/MarketplaceAppInfo';

type Props = {
  appId: string;
  data: MarketplaceDapp | undefined;
  isLoading: boolean;
};

const MarketplaceAppTopBar = ({ appId, data, isLoading }: Props) => {
  const appProps = useAppContext();
  const isMobile = useIsMobile();

  const goBackUrl = React.useMemo(() => {
    if (appProps.referrer && appProps.referrer.includes('/apps') && !appProps.referrer.includes('/apps/')) {
      return appProps.referrer;
    }
    return route({ pathname: '/apps' });
  }, [ appProps.referrer ]);

  const handleBackToClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Back to', Source: mixpanel.PAGE_TYPE_DICT['/apps/[id]'] });
  }, []);

  return (
    <Flex alignItems="center" mb={{ base: 3, md: 2 }} rowGap={ 3 } columnGap={ 2 }>
      { !isMobile && <NetworkIcon mr={ 4 }/> }
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
      <Rating
        appId={ appId }
        rating={ data?.rating }
        ratingsTotalCount={ data?.ratingsTotalCount }
        userRating={ data?.userRating }
        isLoading={ isLoading }
        source="App page"
      />
      { !isMobile && (
        <Flex ml="auto" gap={ 2 }>
          { config.features.rewards.isEnabled && <RewardsButton size="sm"/> }
          <UserProfileDesktop buttonSize="sm"/>
        </Flex>
      ) }
    </Flex>
  );
};

export default MarketplaceAppTopBar;
