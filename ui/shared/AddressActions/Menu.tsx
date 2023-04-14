import { Button, Menu, MenuButton, MenuList, Icon, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import appConfig from 'configs/app/config';
import iconArrow from 'icons/arrows/east-mini.svg';
import getQueryParamString from 'lib/router/getQueryParamString';

import PrivateTagMenuItem from './PrivateTagMenuItem';
import PublicTagMenuItem from './PublicTagMenuItem';
import TokenInfoMenuItem from './TokenInfoMenuItem';

const AddressActions = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const isTokenPage = router.pathname === '/token/[hash]';

  return (
    <Menu>
      <MenuButton
        as={ Button }
        size="sm"
        variant="outline"
        ml={ 2 }
      >
        <Flex alignItems="center">
          <span>More</span>
          <Icon as={ iconArrow } transform="rotate(-90deg)" boxSize={ 5 } ml={ 1 }/>
        </Flex>
      </MenuButton>
      <MenuList minWidth="180px" zIndex="popover">
        { isTokenPage && appConfig.contractInfoApi.endpoint && appConfig.adminServiceApi.endpoint && <TokenInfoMenuItem py={ 2 } px={ 4 } hash={ hash }/> }
        <PublicTagMenuItem py={ 2 } px={ 4 } hash={ hash }/>
        <PrivateTagMenuItem py={ 2 } px={ 4 } hash={ hash }/>
      </MenuList>
    </Menu>
  );
};

export default React.memo(AddressActions);
