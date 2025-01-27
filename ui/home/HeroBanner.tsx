import { Box, Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import RewardsButton from 'ui/rewards/RewardsButton';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import UserProfileDesktop from 'ui/snippets/user/profile/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

// const BACKGROUND_DEFAULT = 'linear-gradient(180deg, #FE2C2E 0%, #CCA43B 100%)';
const BACKGROUND_SMALL = 'https://storage.game7test.io/blockscout/homeplate_bg-base.png';
const BACKGROUND_DEFAULT = 'https://storage.game7test.io/blockscout/homeplate_bg-lg.png';
const TEXT_COLOR_DEFAULT = 'white';
const BORDER_DEFAULT = 'none';

const HeroBanner = () => {
  const background = useColorModeValue(
    config.UI.homepage.heroBanner?.background?.[0] || BACKGROUND_DEFAULT, // config.UI.homepage.plate.background ||
    config.UI.homepage.heroBanner?.background?.[0] || BACKGROUND_DEFAULT,
  );
  const backgroundSm = useColorModeValue(
    config.UI.homepage.heroBanner?.background?.[0] || BACKGROUND_SMALL,
    config.UI.homepage.heroBanner?.background?.[0] || BACKGROUND_SMALL,
  );
  const textColor = useColorModeValue(
    // light mode
    config.UI.homepage.heroBanner?.text_color?.[0] ||
    config.UI.homepage.plate.textColor ||
    TEXT_COLOR_DEFAULT,
    // dark mode
    config.UI.homepage.heroBanner?.text_color?.[1] ||
    config.UI.homepage.heroBanner?.text_color?.[0] ||
    config.UI.homepage.plate.textColor ||
    TEXT_COLOR_DEFAULT,
  );

  const border = useColorModeValue(
    config.UI.homepage.heroBanner?.border?.[0] || BORDER_DEFAULT,
    config.UI.homepage.heroBanner?.border?.[1] || config.UI.homepage.heroBanner?.border?.[0] || BORDER_DEFAULT,
  );

  return (
    <Flex
      w="100%"
      backgroundImage={{
        sm: backgroundSm,
        md: background,
      }}
      backgroundSize="cover"
      backgroundPosition="center"
      border={ border }
      borderRadius="md"
      p={{ base: 4, lg: 8 }}
      columnGap={ 8 }
      alignItems="center"
    >
      <Box flexGrow={ 1 }>
        <Flex mb={{ base: 2, lg: 3 }} justifyContent="space-between" alignItems="center" columnGap={ 2 }>
          <Heading
            as="h1"
            fontSize={{ base: '18px', lg: '30px' }}
            lineHeight={{ base: '24px', lg: '36px' }}
            fontWeight={{ base: 500, lg: 700 }}
            color={ textColor }
          >
            {
              config.meta.seo.enhancedDataEnabled ?
                `${ config.chain.name } Blockchain Explorer` :
                `${ config.chain.name } Explorer`
            }
          </Heading>
          { config.UI.navigation.layout === 'vertical' && (
            <Box display={{ base: 'none', lg: 'flex' }} gap={ 2 }>
              { config.features.rewards.isEnabled && <RewardsButton variant="hero"/> }
              {
                (config.features.account.isEnabled && <UserProfileDesktop buttonVariant="hero"/>) ||
                (config.features.blockchainInteraction.isEnabled && <UserWalletDesktop buttonVariant="hero"/>)
              }
            </Box>
          ) }
        </Flex>
        <SearchBar isHomepage/>
      </Box>
    </Flex>
  );
};

export default React.memo(HeroBanner);
