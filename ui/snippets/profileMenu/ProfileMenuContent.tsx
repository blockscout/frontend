import { Box, Button, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import appConfig from 'configs/app/config';
import useNavItems from 'lib/hooks/useNavItems';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import NavLink from 'ui/snippets/navigation/NavLink';

type Props = UserInfo;

const ProfileMenuContent = ({ name, nickname, email }: Props) => {
  const { accountNavItems, profileItem } = useNavItems();
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const primaryTextColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');

  return (
    <Box>
      <Text
        fontSize="sm"
        fontWeight={ 500 }
        color={ primaryTextColor }
        { ...getDefaultTransitionProps() }
      >
        Signed in as { name || nickname }
      </Text>
      <Text
        fontSize="sm"
        mb={ 1 }
        fontWeight={ 500 }
        color="gray.500"
        { ...getDefaultTransitionProps() }
      >
        { email }
      </Text>
      <NavLink { ...profileItem } isActive={ undefined } px="0px" isCollapsed={ false }/>
      <Box as="nav" mt={ 2 } pt={ 2 } borderTopColor={ borderColor } borderTopWidth="1px" { ...getDefaultTransitionProps() }>
        <VStack as="ul" spacing="0" alignItems="flex-start" overflow="hidden">
          { accountNavItems.map((item) => <NavLink key={ item.text } { ...item } isActive={ undefined } isCollapsed={ false } px="0px"/>) }
        </VStack>
      </Box>
      <Box mt={ 2 } pt={ 3 } borderTopColor={ borderColor } borderTopWidth="1px" { ...getDefaultTransitionProps() }>
        <Button size="sm" width="full" variant="outline" as="a" href={ appConfig.logoutUrl }>Sign Out</Button>
      </Box>
    </Box>
  );
};

export default ProfileMenuContent;
