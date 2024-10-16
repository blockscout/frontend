import type { ButtonProps } from '@chakra-ui/react';
import { Button, chakra, Tooltip } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import { useRewardsContext } from 'lib/contexts/rewards';
import useIsMobile from 'lib/hooks/useIsMobile';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';

type Props = {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
};

const RewardsButton = ({ variant = 'header', size }: Props) => {
  const { apiToken, openLoginModal, dailyReward, balance, isDailyRewardLoading, isBalanceLoading } = useRewardsContext();
  const isMobile = useIsMobile();
  return (
    <Tooltip
      label="Earn merits for using Blockscout"
      textAlign="center"
      padding={ 2 }
      openDelay={ 500 }
      isDisabled={ isMobile }
      width="150px"
    >
      <Button
        variant={ variant }
        data-selected={ Boolean(apiToken) }
        flexShrink={ 0 }
        as={ apiToken ? LinkInternal : 'button' }
        { ...(apiToken ? { href: route({ pathname: '/account/rewards' }) } : {}) }
        onClick={ apiToken ? undefined : openLoginModal }
        fontSize="sm"
        size={ size }
        px={ 2.5 }
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
        <chakra.span display={{ base: 'none', md: 'inline' }} ml={ 2 }>
          { apiToken ? balance?.total : 'Merits' }
        </chakra.span>
      </Button>
    </Tooltip>
  );
};

export default RewardsButton;
