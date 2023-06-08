import { Button, Menu, MenuButton, MenuList, Icon, Flex, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import appConfig from 'configs/app/config';
import iconArrow from 'icons/arrows/east-mini.svg';
import useIsAccountActionAllowed from 'lib/hooks/useIsAccountActionAllowed';
import getQueryParamString from 'lib/router/getQueryParamString';

import PrivateTagMenuItem from './PrivateTagMenuItem';
import PublicTagMenuItem from './PublicTagMenuItem';
import TokenInfoMenuItem from './TokenInfoMenuItem';

interface Props {
  isLoading?: boolean;
}

const AddressActions = ({ isLoading }: Props) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const isTokenPage = router.pathname === '/token/[hash]';
  const isAccountActionAllowed = useIsAccountActionAllowed();

  return (
    <Menu>
      <Skeleton isLoaded={ !isLoading } ml={ 2 } borderRadius="base">
        <MenuButton
          as={ Button }
          size="sm"
          variant="outline"
        >
          <Flex alignItems="center">
            <span>More</span>
            <Icon as={ iconArrow } transform="rotate(-90deg)" boxSize={ 5 } ml={ 1 }/>
          </Flex>
        </MenuButton>
      </Skeleton>
      <MenuList minWidth="180px" zIndex="popover">
        { isTokenPage && appConfig.contractInfoApi.endpoint && appConfig.adminServiceApi.endpoint && appConfig.isAccountSupported &&
          <TokenInfoMenuItem py={ 2 } px={ 4 } hash={ hash } onBeforeClick={ isAccountActionAllowed }/> }
        <PrivateTagMenuItem py={ 2 } px={ 4 } hash={ hash } onBeforeClick={ isAccountActionAllowed }/>
        <PublicTagMenuItem py={ 2 } px={ 4 } hash={ hash } onBeforeClick={ isAccountActionAllowed }/>
      </MenuList>
    </Menu>
  );
};

export default React.memo(AddressActions);
