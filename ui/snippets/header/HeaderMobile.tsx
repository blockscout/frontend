import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import config from 'configs/app';
import { useScrollDirection } from 'lib/contexts/scrollDirection';
import RewardsButton from 'ui/rewards/RewardsButton';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import UserProfileMobile from 'ui/snippets/user/profile/UserProfileMobile';
import UserWalletMobile from 'ui/snippets/user/wallet/UserWalletMobile';

import SearchBarMobile from '../searchBar/SearchBarMobile';
import Burger from './Burger';

type Props = {
  hideSearchButton?: boolean;
  renderSearchBar?: () => React.ReactNode;
};

const HeaderMobile = ({ hideSearchButton }: Props) => {
  const scrollDirection = useScrollDirection();
  const { ref, inView } = useInView({ threshold: 1 });

  return (
    <Box
      ref={ ref }
      bgColor={{ _light: 'white', _dark: 'black' }}
      display={{ base: 'block', lg: 'none' }}
      position="sticky"
      top="-1px"
      left={ 0 }
      zIndex="sticky2"
      pt="1px"
      height="56px"
    >
      <Flex
        as="header"
        paddingX={ 3 }
        paddingY={ 2 }
        bgColor={{ _light: 'white', _dark: 'black' }}
        width="100%"
        alignItems="center"
        transitionProperty="box-shadow"
        transitionDuration="slow"
        boxShadow={ !inView && scrollDirection === 'down' ? 'md' : 'none' }
      >
        <Burger/>
        <NetworkLogo ml={ 2 } mr="auto"/>
        <Flex columnGap={ 2 }>
          { !hideSearchButton && <SearchBarMobile/> }
          { config.features.rewards.isEnabled && <RewardsButton/> }
          { (config.features.account.isEnabled && <UserProfileMobile/>) ||
            (config.features.blockchainInteraction.isEnabled && <UserWalletMobile/>)
          }
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(HeaderMobile);
