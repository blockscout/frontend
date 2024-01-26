import { IconButton, Menu, MenuButton, MenuList, Skeleton, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import useIsAccountActionAllowed from 'lib/hooks/useIsAccountActionAllowed';
import * as mixpanel from 'lib/mixpanel/index';
import getQueryParamString from 'lib/router/getQueryParamString';
import IconSvg from 'ui/shared/IconSvg';

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
          as={ IconButton }
          size="sm"
          variant="outline"
          colorScheme="gray"
          px="7px"
          onClick={ handleButtonClick }
          icon={ <IconSvg name="dots" boxSize="18px"/> }
        />
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
