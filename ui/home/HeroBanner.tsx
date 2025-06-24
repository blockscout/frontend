// we use custom heading size for hero banner
// eslint-disable-next-line no-restricted-imports
import { Box, Flex, Heading, Span } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import RewardsButton from 'ui/rewards/RewardsButton';
import AdBanner from 'ui/shared/ad/AdBanner';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import UserProfileDesktop from 'ui/snippets/user/profile/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

import useIsMobile from '../../lib/hooks/useIsMobile';
import HomeChainSelector from '../shared/HomeChainSelector';

export const BACKGROUND_DEFAULT =
  'radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%), var(--chakra-colors-blue-400)';

const HeroBanner = () => {
  const isMobile = useIsMobile();
  return (
    <Flex
      w="100%"
      background="var(--kda-explorer-hero-banner-background, var(--kda-color-background-base))"
      color="var(--kda-color-text-base-inverse)"
      border="var(--kda-explorer-hero-banner-border)"
      borderRadius="var(--kda-explorer-hero-banner-radius)"
      p="var(--kda-explorer-hero-banner-padding)"
      columnGap="var(--kda-explorer-hero-banner-column-gap)"
      alignItems="center"
    >
      <Box flexGrow={ 1 }>
        <Flex mb="var(--kda-explorer-hero-banner-title-margin-bottom)" justifyContent="space-between" alignItems="center" columnGap={ 2 }>
          <Heading
            as="h1"
            fontSize="var(--kda-explorer-hero-banner-title-font-size)"
            lineHeight="var(--kda-explorer-hero-banner-title-font-line-height)"
            fontWeight="var(--kda-explorer-hero-banner-title-font-weight)"
            color="var(--kda-explorer-hero-banner-title-font-color-name)"
            display="flex"
            flexDirection={{ base: 'column', lg: 'row' }}
            gap="var(--kda-explorer-hero-banner-title-margin-gap)"
            width="var(--kda-explorer-hero-banner-column-width)"
          >
            <Span as="span" whiteSpace={{ base: 'normal', lg: 'nowrap' }}>
              { !isMobile ? config.app.name : config.app.shortName }
              <Span
                as="span"
                color="var(--kda-explorer-hero-banner-title-font-color-prefix)"
                marginLeft="var(--kda-explorer-hero-banner-title-margin-gap)"
              >@</Span>
            </Span>
            <HomeChainSelector/>
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
      <AdBanner platform="mobile" w="fit-content" flexShrink={ 0 } borderRadius="md" overflow="hidden" display={{ base: 'none', lg: 'block ' }}/>
    </Flex>
  );
};

export default React.memo(HeroBanner);
