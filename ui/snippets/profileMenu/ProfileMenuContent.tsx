import { Box, Button, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import useNavItems from 'lib/hooks/useNavItems';
import * as mixpanel from 'lib/mixpanel/index';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import NavLink from 'ui/snippets/navigation/NavLink';

const feature = config.features.account;

type Props = {
  data?: UserInfo;
  onNavLinkClick?: () => void;
};

const ProfileMenuContent = ({ data, onNavLinkClick }: Props) => {
  const { accountNavItems, profileItem } = useNavItems();
  const primaryTextColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');

  const handleSingOutClick = React.useCallback(() => {
    mixpanel.logEvent(
      mixpanel.EventTypes.ACCOUNT_ACCESS,
      { Action: 'Logged out' },
      { send_immediately: true },
    );
  }, []);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Box>
      { (data?.name || data?.nickname) && (
        <Text
          fontSize="sm"
          fontWeight={ 500 }
          color={ primaryTextColor }
          { ...getDefaultTransitionProps() }
        >
        Signed in as { data.name || data.nickname }
        </Text>
      ) }
      { data?.email && (
        <Text
          fontSize="sm"
          mb={ 1 }
          fontWeight={ 500 }
          color="gray.500"
          { ...getDefaultTransitionProps() }
        >
          { data.email }
        </Text>
      ) }
      <NavLink item={ profileItem } isActive={ undefined } px="0px" isCollapsed={ false } onClick={ onNavLinkClick }/>
      <Box as="nav" mt={ 2 } pt={ 2 } borderTopColor="divider" borderTopWidth="1px" { ...getDefaultTransitionProps() }>
        <VStack as="ul" spacing="0" alignItems="flex-start" overflow="hidden">
          { accountNavItems.map((item) => (
            <NavLink
              key={ item.text }
              item={ item }
              isActive={ undefined }
              isCollapsed={ false }
              px="0px"
              onClick={ onNavLinkClick }
            />
          )) }
        </VStack>
      </Box>
      <Box mt={ 2 } pt={ 3 } borderTopColor="divider" borderTopWidth="1px" { ...getDefaultTransitionProps() }>
        <Button size="sm" width="full" variant="outline" as="a" href={ feature.logoutUrl } onClick={ handleSingOutClick }>
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileMenuContent;
