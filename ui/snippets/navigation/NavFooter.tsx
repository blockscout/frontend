import { Box, VStack, Text, Stack, Icon, Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import ghIcon from 'icons/social/git.svg';
import statsIcon from 'icons/social/stats.svg';
import tgIcon from 'icons/social/telega.svg';
import twIcon from 'icons/social/tweet.svg';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

const SOCIAL_LINKS = [
  { link: process.env.NEXT_PUBLIC_FOOTER_GITHUB_LINK, icon: ghIcon, label: 'Github link' },
  { link: process.env.NEXT_PUBLIC_FOOTER_TWITTER_LINK, icon: twIcon, label: 'Twitter link' },
  { link: process.env.NEXT_PUBLIC_FOOTER_TELEGRAM_LINK, icon: tgIcon, label: 'Telegram link' },
  { link: process.env.NEXT_PUBLIC_FOOTER_STAKING_LINK, icon: statsIcon, label: 'Staking analytic link' },
].filter(({ link }) => link !== undefined);

const BLOCKSCOUT_VERSION = process.env.NEXT_PUBLIC_BLOCKSCOUT_VERSION;
const VERSION_URL = `https://github.com/blockscout/blockscout/tree/${ BLOCKSCOUT_VERSION }`;

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
      <Stack direction={{ base: 'row', lg: isExpanded ? 'row' : 'column', xl: isCollapsed ? 'column' : 'row' }}>
        { SOCIAL_LINKS.map(sl => {
          return (
            <Link href={ sl.link } key={ sl.link } variant="secondary" w={ 5 } h={ 5 } aria-label={ sl.label }>
              <Icon as={ sl.icon } boxSize={ 5 }/>
            </Link>
          );
        }) }
      </Stack>
      <Box display={{ base: 'block', lg: isExpanded ? 'block' : 'none', xl: isCollapsed ? 'none' : 'block' }}>
        <Text variant="secondary" mb={ 8 }>
            Blockscout is a tool for inspecting and analyzing EVM based blockchains. Blockchain explorer for Ethereum Networks.
        </Text>
        <Text variant="secondary">Version: <Link href={ VERSION_URL } target="_blank">{ BLOCKSCOUT_VERSION }</Link></Text>
      </Box>
    </VStack>
  );
};

export default NavFooter;
