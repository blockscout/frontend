import { Box, Button, VStack, chakra } from '@chakra-ui/react';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import useNavItems from 'lib/hooks/useNavItems';
import * as mixpanel from 'lib/mixpanel/index';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import NavLink from 'ui/snippets/navigation/vertical/NavLink';

const feature = config.features.account;

type Props = {
  data?: UserInfo;
  onNavLinkClick?: () => void;
};

const ProfileMenuContent = ({ data, onNavLinkClick }: Props) => {
  const { accountNavItems, profileItem } = useNavItems();

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

  const userName = data?.email || data?.nickname || data?.name;

  return (
    <Box>
      { userName && (
        <Box
          fontSize="sm"
          fontWeight={ 500 }
          mb={ 1 }
        >
          <span>Signed in as </span>
          <chakra.span color="text_secondary">{ userName }</chakra.span>
        </Box>
      ) }
      <NavLink item={ profileItem } disableActiveState={ true } px="0px" isCollapsed={ false } onClick={ onNavLinkClick }/>
      <Box as="nav" mt={ 2 } pt={ 2 } borderTopColor="divider" borderTopWidth="1px" { ...getDefaultTransitionProps() }>
        <VStack as="ul" spacing="0" alignItems="flex-start" overflow="hidden">
          { accountNavItems.map((item) => (
            <NavLink
              key={ item.text }
              item={ item }
              disableActiveState={ true }
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
