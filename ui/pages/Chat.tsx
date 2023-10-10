import { Flex, HStack, Icon, VStack, Box, AbsoluteCenter, Divider, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import accountIcon from 'icons/account.svg';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import FilterInput from 'ui/shared/filters/FilterInput';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import PageTitle from 'ui/shared/Page/PageTitle';

interface ExternalChatMessageProps {
  id: string;
  authorAddress: string;
  authorENS?: string;
  date: number;
  text: string;
}

const ExternalChatMessage = ({ authorAddress, authorENS }: ExternalChatMessageProps) => {
  const backgroundColor = useColorModeValue('gray.100', 'gray.800');
  return (
    <Flex flexDir="row" justify="flex-start">
      <Flex flexDir="row" maxW="500px" gap={ 3 }>
        <Flex>
          <Icon boxSize={ 10 } as={ accountIcon }/>
        </Flex>
        <Flex flexDir="column" grow={ 1 } gap={ 2 }>
          <Flex justify="space-between" fontSize={ 14 } gap={ 20 } lineHeight={ 1 }>
            <Flex grow={ 1 } fontWeight={ 500 }>
              <AddressEntity address={{ hash: authorAddress, name: authorENS }} noIcon noCopy/>
            </Flex>
            <Flex>
                Thursday 10:16am
            </Flex>
          </Flex>
          <Flex background={ backgroundColor } paddingX={ 3 } paddingY={ 2 } borderRadius={ 8 } borderTopLeftRadius={ 0 }>text</Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const InternalChatMessage = ({ }: ExternalChatMessageProps) => {
  const backgroundColor = useColorModeValue('gray.100', 'gray.800');
  return (
    <Flex flexDir="row" justify="flex-end">
      <Flex flexDir="row" maxW="500px">
        <Flex flexDir="column" grow={ 1 } gap={ 2 }>
          <Flex justify="space-between" fontSize={ 14 } gap={ 20 } lineHeight={ 1 }>
            <Flex grow={ 1 } fontWeight={ 500 }>
              You
            </Flex>
            <Flex>
                Thursday 10:16am
            </Flex>
          </Flex>
          <Flex background={ backgroundColor } paddingX={ 3 } paddingY={ 2 } borderRadius={ 8 } borderTopRightRadius={ 0 }>text</Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const ChatDivider = ({ title }: { title?: string }) => {
  const textColor = useColorModeValue('gray.400', 'gray.600');
  return (
    <Box position="relative" paddingY={ 4 }>
      <Divider/>
      <AbsoluteCenter bg="black" px="4" fontSize={ 14 } fontWeight={ 500 } color={ textColor }>
        { title }
      </AbsoluteCenter>
    </Box>
  );
};

const ChatPageContent = () => {
  const router = useRouter();
  const [ filter, setFilter ] = React.useState<string>(router.query.q?.toString() || '');

  const authorAddressString = getQueryParamString(router.query.hash);

  const onSearchChange = useCallback((value: string) => {
    // onFilterChange({ q: value });
    setFilter(value);
  }, [ ]); // onFilterChange

  const filterInput = (
    <FilterInput
      w="300px"
      size="xs"
      onChange={ onSearchChange }
      placeholder="Search by type, address, hash, method..."
      initialValue={ filter }
    />
  );

  const defaultChat = {
    authorAddress: '0x15a33D60283e3D20751D6740162D1212c1ad2a2d',
    authorENS: 'sewald.eth',
    date: Math.floor(Date.now() / 1000) - 17 * 60,
    text: 'Lorem ipsum dolor sit amet consectetur.',
  };

  return (
    <Flex position="relative" flexDir="column">
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle
          backLink={{ url: '/forum/chats', label: 'Chats list' }}
          containerProps={{ mb: 0 }}
          title={ authorAddressString.substring(0, 6) + '...' + authorAddressString.substring(authorAddressString.length - 4) }
        />
        <Flex flexDir="row" justify="flex-end" gap={ 3 }>
          { filterInput }
          <ChatsAccountsBar compact={ true } noChats/>
        </Flex>
      </HStack>
      <VStack align="stretch" gap={ 4 }>
        <ExternalChatMessage
          id="1"
          { ...defaultChat }
        />
        <InternalChatMessage
          id="1"
          { ...defaultChat }
        />
        <ExternalChatMessage
          id="1"
          { ...defaultChat }
        />
        <ChatDivider title="Today"/>
        <InternalChatMessage
          id="1"
          { ...defaultChat }
        />
        <ExternalChatMessage
          id="1"
          { ...defaultChat }
        />
      </VStack>
    </Flex>
  );
};

export default ChatPageContent;
