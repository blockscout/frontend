import { Button, Menu, MenuButton, MenuItem, MenuList, Icon, Flex } from '@chakra-ui/react';
import React from 'react';

import iconArrow from 'icons/arrows/east-mini.svg';

const TokenDetailsActions = () => {
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
        <MenuItem py={ 2 } px={ 4 }>
            Add public tag
        </MenuItem>
        <MenuItem py={ 2 } px={ 4 }>
            Add private tag
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default React.memo(TokenDetailsActions);
