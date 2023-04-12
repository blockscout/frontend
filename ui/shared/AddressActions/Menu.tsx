import { Button, Menu, MenuButton, MenuItem, MenuList, Icon, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import iconArrow from 'icons/arrows/east-mini.svg';
import getQueryParamString from 'lib/router/getQueryParamString';

import PrivateTagMenuItem from './PrivateTagMenuItem';
import PublicTagMenuItem from './PublicTagMenuItem';

const AddressActions = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

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
        <MenuItem py={ 2 } px={ 4 }>
            Add token info
        </MenuItem>
        <PublicTagMenuItem py={ 2 } px={ 4 } hash={ hash }/>
        <PrivateTagMenuItem py={ 2 } px={ 4 } hash={ hash }/>
      </MenuList>
    </Menu>
  );
};

export default React.memo(AddressActions);
