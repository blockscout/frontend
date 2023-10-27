import { Flex, HStack, Icon, Spinner, Textarea, VStack, useColorModeValue, useToast } from '@chakra-ui/react';
import { EVMNetwork, EVM_CHAINS, EVM_NAMES } from '@ylide/ethereum';
import { YLIDE_MAIN_FEED_ID, type IMessage } from '@ylide/sdk';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';

import type { DomainAccount } from 'lib/contexts/ylide/types';

import accountIcon from 'icons/account.svg';
import sendIcon from 'icons/send.svg';
import ChatsPersonalApi from 'lib/api/ylideApi/ChatsPersonalApi';
import { MessageDecodedTextDataType, useYlide } from 'lib/contexts/ylide';
import type { IMessageDecodedContent } from 'lib/contexts/ylide';
import getQueryParamString from 'lib/router/getQueryParamString';
import shortDate from 'lib/shortDate';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import SelectAccountDropdown from 'ui/shared/forum/SelectAccountDropdown';
import SelectBlockchainDropdown from 'ui/shared/forum/SelectBlockchainDropdown';
import PageTitle from 'ui/shared/Page/PageTitle';

interface ExternalChatMessageProps {
  id: string;
  authorAddress: string;
  authorENS?: string;
  date: number;
  text: string;
}

const ExternalChatMessage = ({ authorAddress, authorENS, text, date }: ExternalChatMessageProps) => {
  const backgroundColor = useColorModeValue('gray.100', 'gray.800');
  return (
    <Flex flexDir="row" justify="flex-start">
      <Flex flexDir="row" maxW="500px" gap={ 3 }>
        <Flex>
          <Icon boxSize={ 10 } as={ accountIcon }/>
        </Flex>
        <Flex flexDir="column" grow={ 1 } gap={ 2 }>
          <Flex justify="space-between" fontSize={ 14 } gap={ 5 } lineHeight={ 1 }>
            <Flex grow={ 1 } fontWeight={ 500 } maxW="200px">
              <AddressEntity truncation="constant" address={{ hash: authorAddress, name: authorENS }} noIcon noCopy/>
            </Flex>
            <Flex flexShrink={ 0 }>
              { shortDate(date * 1000) }
            </Flex>
          </Flex>
          <Flex background={ backgroundColor } paddingX={ 3 } paddingY={ 2 } borderRadius={ 8 } borderTopLeftRadius={ 0 }>{ text }</Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const InternalChatMessage = ({ text, date }: ExternalChatMessageProps) => {
  const backgroundColor = useColorModeValue('gray.100', 'gray.800');
  return (
    <Flex flexDir="row" justify="flex-end">
      <Flex flexDir="row" maxW="500px">
        <Flex flexDir="column" grow={ 1 } gap={ 2 }>
          <Flex justify="space-between" fontSize={ 14 } gap={ 5 } lineHeight={ 1 }>
            <Flex grow={ 1 } fontWeight={ 500 } maxW="200px">
              You
            </Flex>
            <Flex flexShrink={ 0 }>
              { shortDate(date * 1000) }
            </Flex>
          </Flex>
          <Flex background={ backgroundColor } paddingX={ 3 } paddingY={ 2 } borderRadius={ 8 } borderTopRightRadius={ 0 }>{ text }</Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

// const ChatDivider = ({ title }: { title?: string }) => {
//   const textColor = useColorModeValue('gray.400', 'gray.600');
//   return (
//     <Box position="relative" paddingY={ 4 }>
//       <Divider/>
//       <AbsoluteCenter bg="black" px="4" fontSize={ 14 } fontWeight={ 500 } color={ textColor }>
//         { title }
//       </AbsoluteCenter>
//     </Box>
//   );
// };

const ChatPageContent = () => {
  const router = useRouter();
  const authorAddressString = getQueryParamString(router.query.hash);

  const { accounts: { initialized, domainAccounts }, decodeDirectMessage, sendMessage } = useYlide();
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const [ sending, setSending ] = React.useState(false);
  const [ reloadTick, setReloadTick ] = React.useState(0);
  const [ messages, setMessages ] = React.useState<Array<{
    id: string;
    type: 'message';
    isIncoming: boolean;
    msg: IMessage;
  }>>([]);
  const [ decodedMessages, setDecodedMessages ] = React.useState<Record<string, IMessageDecodedContent | null>>({});
  const getMessages = ChatsPersonalApi.useGetMessages();
  const toast = useToast();

  const [ replyText, setReplyText ] = React.useState<string>('');
  const [ account, setAccount ] = React.useState<DomainAccount | undefined>(domainAccounts[0]);
  const [ blockchain, setBlockchain ] = React.useState<string>('GNOSIS');

  React.useEffect(() => {
    if (!account && domainAccounts.length) {
      setAccount(domainAccounts[0]);
    } else
    if (account && domainAccounts.findIndex(d => d.account.address === account.account.address) === -1) {
      setAccount(undefined);
    }
  }, [ account, domainAccounts ]);

  const handleAccountChange = useCallback((newAccount: DomainAccount | undefined) => {
    setAccount(newAccount);
  }, []);

  const handleBlockchainChange = useCallback((newBlockchain: string) => {
    setBlockchain(newBlockchain);
    if (account) {
      const networkByName = (name: string) =>
        Object.values(EVMNetwork).filter(t => !isNaN(Number(t))).find(t => EVM_NAMES[Number(t) as EVMNetwork] === name) as EVMNetwork;
      const network = networkByName(newBlockchain);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      account.wallet.onNetworkSwitchRequest('', undefined, network, EVM_CHAINS[network]);
    }
  }, [ account ]);

  const handleSend = useCallback(async() => {
    if (!authorAddressString || !account) {
      return;
    }
    const feedId = YLIDE_MAIN_FEED_ID;
    setSending(true);
    try {
      await sendMessage(account, [ authorAddressString ], feedId, 'Chat Message', replyText, blockchain);
      setTimeout(() => {
        getMessages(account.account.address, authorAddressString).then(r => {
          setSending(false);
          setReplyText('');
          setMessages(r.data.entries.reverse());
          setTimeout(() => {
            messagesContainerRef.current?.scroll({
              top: messagesContainerRef.current?.scrollHeight || 10000,
              behavior: 'instant',
            });
          }, 1);
        }).catch(() => {
          setSending(false);
        });
      }, 6000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setSending(false);
      if (err && typeof err.message === 'string' && err.message.startsWith('ACCOUNT_UNREACHABLE:')) {
        toast({
          position: 'top-right',
          title: 'Error',
          description: err.message.split('ACCOUNT_UNREACHABLE: ')[1],
          status: 'error',
          variant: 'subtle',
          isClosable: true,
        });
      } else {
        toast({
          position: 'top-right',
          title: 'Error',
          description: (err as ({ payload: string } | undefined))?.payload || 'There was an error while sending message.',
          status: 'error',
          variant: 'subtle',
          isClosable: true,
        });
      }
    }
  }, [ authorAddressString, account, sendMessage, replyText, getMessages, blockchain, toast ]);

  const handleReplyTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  }, []);

  React.useEffect(() => {
    if (initialized && domainAccounts.length && reloadTick >= 0) {
      getMessages(domainAccounts[0].account.address, authorAddressString).then(r => {
        setMessages(r.data.entries.reverse());
        if (reloadTick === 0) {
          setTimeout(() => {
            messagesContainerRef.current?.scroll({
              top: messagesContainerRef.current?.scrollHeight || 10000,
              behavior: 'instant',
            });
          }, 1);
        }
      });
    }
  }, [ initialized, domainAccounts, getMessages, authorAddressString, reloadTick ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setReloadTick(tick => tick + 1);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    (async() => {
      let isChanged = false;
      const newDecodedMessages = { ...decodedMessages };
      await Promise.all(messages.map(async m => {
        if (typeof newDecodedMessages[m.id] !== 'undefined') {
          return;
        }
        const decoded = await decodeDirectMessage(m.id, m.msg, domainAccounts[0].account);
        newDecodedMessages[m.id] = decoded;
        isChanged = true;
      }));
      if (isChanged) {
        setDecodedMessages(newDecodedMessages);
        setTimeout(() => {
          messagesContainerRef.current?.scroll({
            top: messagesContainerRef.current?.scrollHeight || 10000,
            behavior: 'instant',
          });
        }, 1);
      }
    })();
  }, [ messages, decodedMessages, domainAccounts, decodeDirectMessage ]);

  return (
    <Flex position="relative" flexDir="column">
      <HStack align={{ base: 'stretch', sm: 'center' }} flexDir={{ base: 'column', sm: 'row' }} justify="space-between" mb={ 6 }>
        <PageTitle
          backLink={{ url: '/forum/chats', label: 'Chats list' }}
          containerProps={{ mb: 0 }}
          title={ authorAddressString.substring(0, 6) + '...' + authorAddressString.substring(authorAddressString.length - 4) }
        />
        <Flex flexDir="row" justify="flex-end" gap={ 3 }>
          { /* { filterInput } */ }
          <ChatsAccountsBar noChats/>
        </Flex>
      </HStack>
      <VStack ref={ messagesContainerRef } align="stretch" gap={ 4 } h="calc(100vh - 400px)" overflowY="scroll" paddingBottom={ 5 }>
        { messages.map(m => {
          const dec = decodedMessages[m.id];
          let text;
          if (dec) {
            if (dec.decodedTextData.type === MessageDecodedTextDataType.PLAIN) {
              text = dec.decodedTextData.value;
            } else {
              text = dec.decodedTextData.value.toPlainText();
            }
          } else {
            text = '[no-content-available]';
          }
          return (
            m.isIncoming ? (
              <ExternalChatMessage
                key={ m.id }
                id={ m.id }
                authorAddress={ m.msg.senderAddress }
                date={ m.msg.createdAt }
                text={ text }
              />
            ) : (
              <InternalChatMessage
                key={ m.id }
                id={ m.id }
                authorAddress={ m.msg.senderAddress }
                date={ m.msg.createdAt }
                text={ text }
              />
            )
          );
        }) }
      </VStack>
      <Flex flexDir="column" mb={ 6 } marginX={{ base: 0, sm: -12 }} paddingX={{ base: 0, sm: 12 }}>
        <Flex flexDir="column" border="1px solid" borderRadius={ 12 } borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }>
          <Flex flexDir="row" padding={ 6 } align="center" borderBottom="1px solid" borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }>
            <Textarea
              border="0"
              h="50px"
              flexDir="row"
              flexGrow={ 1 }
              value={ replyText }
              placeholder="Type text here..."
              onChange={ handleReplyTextChange }
              minH="50px"
              disabled={ sending }
            />
          </Flex>

          <Flex flexDir="row" justify="flex-start" padding={ 6 }>
            <Flex
              flexDir={{ base: 'column', sm: 'row' }}
              justify="space-between"
              mr={ 6 }
              flexGrow={ 1 }
              gap={{ base: 3, sm: 0 }}
            >
              <SelectAccountDropdown
                value={ account }
                onChange={ handleAccountChange }
              />
              <SelectBlockchainDropdown
                account={ account }
                value={ blockchain }
                onChange={ handleBlockchainChange }
              />
            </Flex>
            <Flex flexDir="row" align="center">
              { sending ? (
                <Spinner/>
              ) : (
                <Icon
                  as={ sendIcon }
                  boxSize={ 6 }
                  cursor="pointer"
                  _hover={{ color: 'link_hovered' }}
                  onClick={ handleSend }
                />
              ) }
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChatPageContent;
