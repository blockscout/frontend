import { Icon, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import chatIcon from 'icons/chat.svg';

import LinkInternal from '../LinkInternal';
import AccountsPopover from './AccountsPopover';

interface Props {
  compact?: boolean;
  noChats?: boolean;
}

const ChatsAccountsBar = ({ compact, noChats }: Props) => {
  const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');

  return (
    <Flex gap={ compact ? 3 : 2 }>
      { !noChats && (compact ? (
        <LinkInternal
          aria-label="chats"
          size="sm"
          colorScheme="gray-dark"
          minWidth="32px"
          minHeight="32px"
          borderWidth={ 1 }
          borderRadius="base"
          display="flex"
          fontWeight={ 500 }
          border="1px solid"
          variant="outline"
          paddingX={ 1 }
          borderColor={ borderColor }
          alignItems="center"
          justifyContent="center"
          href="/forum/chats"
          _hover={{
            borderColor: 'link_hovered',
            color: 'link_hovered',
          }}
        ><Icon as={ chatIcon } boxSize={ 5 }/></LinkInternal>
      ) : (
        <Button
          leftIcon={ <Icon as={ chatIcon } boxSize={ 5 }/> }
          aria-label="chats"
          size="sm"
          colorScheme="gray-dark"
          borderWidth={ 1 }
          minWidth="32px"
          minHeight="32px"
          fontWeight={ 500 }
          borderColor={ borderColor }
          variant="outline"
        >Chat list</Button>
      )) }
      <AccountsPopover minHeight="32px"/>
    </Flex>
  );
};

export default ChatsAccountsBar;
