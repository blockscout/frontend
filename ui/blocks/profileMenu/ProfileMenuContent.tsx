import { Box, Button, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import useNavItems from 'lib/hooks/useNavItems';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import NavLink from 'ui/blocks/navigation/NavLink';

type Props = UserInfo;

const ProfileMenuContent = ({ name, nickname, email }: Props) => {
  const { accountNavItems, profileItem } = useNavItems();
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const primaryTextColor = useColorModeValue('gray.600', 'whiteAlpha.800');

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
      <NavLink { ...profileItem } px="0px"/>
      <Box as="nav" mt={ 2 } pt={ 2 } borderTopColor={ borderColor } borderTopWidth="1px" { ...getDefaultTransitionProps() }>
        <VStack as="ul" spacing="0" alignItems="flex-start" overflow="hidden">
          { accountNavItems.map((item) => <NavLink key={ item.text } { ...item } px="0px"/>) }
        </VStack>
      </Box>
      <Box mt={ 2 } pt={ 3 } borderTopColor={ borderColor } borderTopWidth="1px" { ...getDefaultTransitionProps() }>
        <Button size="sm" width="full" variant="secondary">Sign Out</Button>
      </Box>
    </Box>
  );
};

export default ProfileMenuContent;
