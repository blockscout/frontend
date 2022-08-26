import { VStack, Text, Stack, Icon, Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import ghIcon from 'icons/social/git.svg';
import statsIcon from 'icons/social/stats.svg';
import tgIcon from 'icons/social/telega.svg';
import twIcon from 'icons/social/tweet.svg';
import useIsMobile from 'lib/hooks/useIsMobile';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

const SOCIAL_LINKS = [
  { link: '#gh', icon: ghIcon },
  { link: '#tw', icon: twIcon },
  { link: '#tg', icon: tgIcon },
  { link: '#stats', icon: statsIcon },
];

interface Props {
  isCollapsed?: boolean;
}

const NavFooter = ({ isCollapsed }: Props) => {
  const isMobile = useIsMobile();

  const width = (() => {
    if (isMobile) {
      return '100%';
    }

    return isCollapsed ? '20px' : '180px';
  })();

  return (
    <VStack
      as="footer"
      spacing={ 8 }
      borderTop="1px solid"
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      width={ width }
      paddingTop={ isMobile ? 6 : 8 }
      marginTop={ isMobile ? 6 : 20 }
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
          <Text variant="secondary">Version: <Link>v4.2.1-beta</Link></Text>
        </>
      ) }
    </VStack>
  );
};

export default NavFooter;
