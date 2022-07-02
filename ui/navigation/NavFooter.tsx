import React from 'react';

import { VStack, Text, HStack, Icon, Link } from '@chakra-ui/react';

import ghIcon from '../../icons/social/git.svg';
import twIcon from '../../icons/social/tweet.svg';
import tgIcon from '../../icons/social/telega.svg';
import statsIcon from '../../icons/social/stats.svg';

const SOCIAL_LINKS = [
  { link: '#gh', icon: ghIcon },
  { link: '#tw', icon: twIcon },
  { link: '#tg', icon: tgIcon },
  { link: '#stats', icon: statsIcon },
]

const NavFooter = () => {
  return (
    <VStack
      as="footer"
      spacing={ 8 }
      borderTop="1px solid"
      borderColor="gray.200"
      paddingTop={ 8 }
      w="100%"
      alignItems="baseline"
      color="gray.500"
      fontSize="xs"
    >
      <HStack>
        { SOCIAL_LINKS.map(sl => {
          return (
            <Link href={ sl.link } key={ sl.link }>
              <Icon as={ sl.icon } boxSize={ 5 }/>
            </Link>
          )
        }) }
      </HStack>
      <Text>
        Blockscout is a tool for inspecting and analyzing EVM based blockchains. Blockchain explorer for Ethereum Networks.
      </Text>
      <Text>Version: <Link color="blue.500">v4.2.1-beta</Link></Text>
    </VStack>
  )
}

export default NavFooter;
