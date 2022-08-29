import { VStack, Text, Stack, Icon, Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import ghIcon from 'icons/social/git.svg';
import statsIcon from 'icons/social/stats.svg';
import tgIcon from 'icons/social/telega.svg';
import twIcon from 'icons/social/tweet.svg';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

const SOCIAL_LINKS = [
  { link: process.env.NEXT_PUBLIC_FOOTER_GITHUB_LINK, icon: ghIcon },
  { link: process.env.NEXT_PUBLIC_FOOTER_TWITTER_LINK, icon: twIcon },
  { link: process.env.NEXT_PUBLIC_FOOTER_TELEGRAM_LINK, icon: tgIcon },
  { link: process.env.NEXT_PUBLIC_FOOTER_STAKING_LINK, icon: statsIcon },
].filter(({ link }) => link !== undefined);

const BLOCKSCOUT_VERSION = process.env.NEXT_PUBLIC_BLOCKSCOUT_VERSION;
const VERSION_URL = `https://github.com/blockscout/blockscout/tree/${ BLOCKSCOUT_VERSION }`;

interface Props {
  isCollapsed: boolean;
}

const NavFooter = ({ isCollapsed }: Props) => {
  return (
    <VStack
      as="footer"
      spacing={ 8 }
      borderTop="1px solid"
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      width={ isCollapsed ? '20px' : '180px' }
      paddingTop={ 8 }
      marginTop={ 20 }
      alignItems="flex-start"
      color="gray.500"
      fontSize="xs"
      { ...getDefaultTransitionProps({ transitionProperty: 'width' }) }
    >
      <Stack direction={ isCollapsed ? 'column' : 'row' }>
        { SOCIAL_LINKS.map(sl => {
          return (
            <Link href={ sl.link } key={ sl.link } variant="secondary" w={ 5 } h={ 5 }>
              <Icon as={ sl.icon } boxSize={ 5 }/>
            </Link>
          );
        }) }
      </Stack>
      { !isCollapsed && (
        <>
          <Text variant="secondary">
            Blockscout is a tool for inspecting and analyzing EVM based blockchains. Blockchain explorer for Ethereum Networks.
          </Text>
          <Text variant="secondary">Version: <Link href={ VERSION_URL } target="_blank">{ BLOCKSCOUT_VERSION }</Link></Text>
        </>
      ) }
    </VStack>
  );
};

export default NavFooter;
