import { chakra } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import { route } from 'nextjs-routes';

import { useRewardsContext } from 'lib/contexts/rewards';
import useIsMobile from 'lib/hooks/useIsMobile';
import type { ButtonProps } from 'toolkit/chakra/button';
import { Button } from 'toolkit/chakra/button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';

type Props = {
  size?: ButtonProps['size'];
  visual?: ButtonProps['visual'];
};

// TODO @tom2drum check this component

const RewardsButton = ({ visual = 'header', size }: Props) => {
  const { isInitialized, apiToken, openLoginModal, dailyRewardQuery, balancesQuery } = useRewardsContext();
  const isMobile = useIsMobile();
  const isLoading = !isInitialized || dailyRewardQuery.isLoading || balancesQuery.isLoading;

  const handleFocus = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Tooltip
      content="Earn Merits for using Blockscout"
      openDelay={ 500 }
      disabled={ isMobile || isLoading || Boolean(apiToken) }
      // width="150px"
    >
      <Button
        visual={ visual }
        data-selected={ !isLoading && Boolean(apiToken) }
        flexShrink={ 0 }
        as={ apiToken ? LinkInternal : 'button' }
        { ...(apiToken ? { href: route({ pathname: '/account/rewards' }) } : {}) }
        onClick={ apiToken ? undefined : openLoginModal }
        onFocus={ handleFocus }
        fontSize="sm"
        size={ size }
        px={ !isLoading && Boolean(apiToken) ? 2.5 : 4 }
        loading={ isLoading }
        _hover={{
          textDecoration: 'none',
        }}
      >
        <IconSvg
          name={ dailyRewardQuery.data?.available ? 'merits_with_dot_slim' : 'merits_slim' }
          boxSize={ visual === 'hero' ? 6 : 5 }
          flexShrink={ 0 }
        />
        <chakra.span
          display={{ base: 'none', md: 'inline' }}
          fontWeight={ apiToken ? '700' : '600' }
        >
          { apiToken ? (balancesQuery.data?.total || 'N/A') : 'Merits' }
        </chakra.span>
      </Button>
    </Tooltip>
  );
};

export default RewardsButton;
