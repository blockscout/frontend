import { VStack, Text, HStack, Icon, Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import ghIcon from 'icons/social/git.svg';
import statsIcon from 'icons/social/stats.svg';
import tgIcon from 'icons/social/telega.svg';
import twIcon from 'icons/social/tweet.svg';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

const SOCIAL_LINKS = [
  { link: '#gh', icon: ghIcon },
  { link: '#tw', icon: twIcon },
  { link: '#tg', icon: tgIcon },
  { link: '#stats', icon: statsIcon },
];

const NavFooter = () => {
  return (
    <VStack
      as="footer"
      spacing={ 8 }
      borderTop="1px solid"
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      paddingTop={ 8 }
      marginTop={ 20 }
      w="100%"
      alignItems="baseline"
      color="gray.500"
      fontSize="xs"
      { ...getDefaultTransitionProps() }
    >
      <HStack>
        { SOCIAL_LINKS.map(sl => {
          return (
            <Link href={ sl.link } key={ sl.link } variant="secondary">
              <Icon as={ sl.icon } boxSize={ 5 }/>
            </Link>
          );
        }) }
      </HStack>
      <Text variant="secondary">
        Blockscout is a tool for inspecting and analyzing EVM based blockchains. Blockchain explorer for Ethereum Networks.
      </Text>
      <Text variant="secondary">Version: <Link>v4.2.1-beta</Link></Text>
    </VStack>
  );
};

export default NavFooter;
