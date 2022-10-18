import { Box, VStack, Text, Stack, Icon, Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import ghIcon from 'icons/social/git.svg';
import statsIcon from 'icons/social/stats.svg';
import tgIcon from 'icons/social/telega.svg';
import twIcon from 'icons/social/tweet.svg';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

const SOCIAL_LINKS = [
  { link: appConfig.footerLinks.github, icon: ghIcon, label: 'Github link' },
  { link: appConfig.footerLinks.twitter, icon: twIcon, label: 'Twitter link' },
  { link: appConfig.footerLinks.telegram, icon: tgIcon, label: 'Telegram link' },
  { link: appConfig.footerLinks.staking, icon: statsIcon, label: 'Staking analytic link' },
].filter(({ link }) => link);

const VERSION_URL = `https://github.com/blockscout/blockscout/tree/${ appConfig.blockScoutVersion }`;

interface Props {
  isCollapsed?: boolean;
  hasAccount?: boolean;
}

const NavFooter = ({ isCollapsed, hasAccount }: Props) => {
  const isExpanded = isCollapsed === false;
  const marginTop = (() => {
    if (!hasAccount) {
      return 'auto';
    }

    return { base: 6, lg: 20 };
  })();

  return (
    <VStack
      as="footer"
      spacing={ 8 }
      borderTop="1px solid"
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      width={{ base: '100%', lg: isExpanded ? '180px' : '20px', xl: isCollapsed ? '20px' : '180px' }}
      paddingTop={{ base: 6, lg: 8 }}
      marginTop={ marginTop }
      alignItems="flex-start"
      alignSelf="center"
      color="gray.500"
      fontSize="xs"
      { ...getDefaultTransitionProps({ transitionProperty: 'width' }) }
    >
      { SOCIAL_LINKS.length > 0 && (
        <Stack direction={{ base: 'row', lg: isExpanded ? 'row' : 'column', xl: isCollapsed ? 'column' : 'row' }}>
          { SOCIAL_LINKS.map(sl => {
            return (
              <Link href={ sl.link } key={ sl.link } variant="secondary" w={ 5 } h={ 5 } aria-label={ sl.label }>
                <Icon as={ sl.icon } boxSize={ 5 }/>
              </Link>
            );
          }) }
        </Stack>
      ) }
      <Box display={{ base: 'block', lg: isExpanded ? 'block' : 'none', xl: isCollapsed ? 'none' : 'block' }}>
        <Text variant="secondary" mb={ 8 }>
            Blockscout is a tool for inspecting and analyzing EVM based blockchains. Blockchain explorer for Ethereum Networks.
        </Text>
        { appConfig.blockScoutVersion &&
          <Text variant="secondary">Version: <Link href={ VERSION_URL } target="_blank">{ appConfig.blockScoutVersion }</Link></Text> }
      </Box>
    </VStack>
  );
};

export default NavFooter;
