import { Icon, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import chatIcon from 'icons/chat.svg';

import LinkInternal from '../LinkInternal';
import AccountsPopover from './AccountsPopover';

interface Props {
  compact?: boolean;
  noChats?: boolean;
}

const ChatsAccountsBar = ({ compact, noChats }: Props) => {
  const router = useRouter();
  const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');

  const handleClick = useCallback(() => {
    router.push({ pathname: '/forum/chats' });
  }, [ router ]);

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
          onClick={ handleClick }
        >Chat list</Button>
      )) }
      <AccountsPopover minHeight="32px"/>
    </Flex>
  );
};

export default ChatsAccountsBar;
