import { Button, Menu, MenuButton, MenuList, Icon, Flex, Skeleton, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import iconArrow from 'icons/arrows/east-mini.svg';
import useIsAccountActionAllowed from 'lib/hooks/useIsAccountActionAllowed';
import * as mixpanel from 'lib/mixpanel/index';
import getQueryParamString from 'lib/router/getQueryParamString';

import PrivateTagMenuItem from './items/PrivateTagMenuItem';
import PublicTagMenuItem from './items/PublicTagMenuItem';
import TokenInfoMenuItem from './items/TokenInfoMenuItem';

interface Props {
  isLoading?: boolean;
  className?: string;
}

const AccountActionsMenu = ({ isLoading, className }: Props) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const isTokenPage = router.pathname === '/token/[hash]';
  const isTxPage = router.pathname === '/tx/[hash]';
  const isAccountActionAllowed = useIsAccountActionAllowed();

  const handleButtonClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Address actions (more button)' });
  }, []);

  if (!config.features.account.isEnabled) {
    return null;
  }

  return (
    <Menu>
      <Skeleton isLoaded={ !isLoading } borderRadius="base" className={ className }>
        <MenuButton
          as={ Button }
          size="sm"
          variant="outline"
          onClick={ handleButtonClick }
        >
          <Flex alignItems="center">
            <span>More</span>
            <Icon as={ iconArrow } transform="rotate(-90deg)" boxSize={ 5 } ml={ 1 }/>
          </Flex>
        </MenuButton>
      </Skeleton>
      <MenuList minWidth="180px" zIndex="popover">
        { isTokenPage && config.features.addressVerification.isEnabled &&
          <TokenInfoMenuItem py={ 2 } px={ 4 } hash={ hash } onBeforeClick={ isAccountActionAllowed }/> }
        <PrivateTagMenuItem
          py={ 2 }
          px={ 4 }
          hash={ hash }
          onBeforeClick={ isAccountActionAllowed }
          type={ isTxPage ? 'tx' : 'address' }
        />
        { !isTxPage && <PublicTagMenuItem py={ 2 } px={ 4 } hash={ hash } onBeforeClick={ isAccountActionAllowed }/> }
      </MenuList>
    </Menu>
  );
};

export default React.memo(chakra(AccountActionsMenu));
