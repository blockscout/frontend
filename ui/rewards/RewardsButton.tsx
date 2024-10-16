import { Button, chakra, Tooltip } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import { useRewardsContext } from 'lib/contexts/rewards';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';

type Props = {
  isHomePage?: boolean;
  isMobile?: boolean;
  size?: 'sm' | 'md';
};

const RewardsButton = ({ isHomePage, isMobile, size }: Props) => {
  const { apiToken, openLoginModal, dailyReward, balance, isDailyRewardLoading, isBalanceLoading } = useRewardsContext();
  return (
    <Tooltip
      label="Earn merits for using Blockscout"
      textAlign="center"
      padding={ 2 }
      openDelay={ 500 }
      display={ isMobile ? 'none' : 'flex' }
      width="150px"
    >
      <Button
        variant={ isHomePage ? 'hero' : 'header' }
        data-selected={ Boolean(apiToken) }
        flexShrink={ 0 }
        as={ apiToken ? LinkInternal : 'button' }
        { ...(apiToken ? { href: route({ pathname: '/account/rewards' }) } : {}) }
        onClick={ apiToken ? undefined : openLoginModal }
        fontSize="sm"
        size={ size }
        mr={ isMobile ? 0 : 2 }
        boxSize={ isMobile ? '40px' : 'auto' }
        isLoading={ isDailyRewardLoading || isBalanceLoading }
        loadingText={ isMobile ? undefined : 'Merits' }
        textDecoration="none !important"
      >
        <IconSvg
          name={ dailyReward?.available ? 'merits_with_dot' : 'merits' }
          boxSize={ size === 'sm' ? '26px' : '28px' }
          flexShrink={ 0 }
          mx={ -1 }
        />
        <chakra.span display={ isMobile ? 'none' : 'inline' } ml={ 2 }>
          { apiToken ? balance?.total : 'Merits' }
        </chakra.span>
      </Button>
    </Tooltip>
  );
};

export default RewardsButton;
