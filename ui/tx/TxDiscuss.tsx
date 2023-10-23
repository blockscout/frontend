import { Flex, HStack, chakra, useColorModeValue, Text, Icon, Spinner, Textarea, Button, useToast } from '@chakra-ui/react';
import { EVMNetwork, EVM_NAMES, EVM_CHAINS } from '@ylide/ethereum';
import { YMF } from '@ylide/sdk';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { ForumReply, ForumThread } from 'lib/api/ylideApi/types';
import type { DomainAccount } from 'lib/contexts/ylide/types';
import type { RepliesSorting } from 'types/api/forum';

import type { Query } from 'nextjs-routes';

import crossIcon from 'icons/cross.svg';
import sendIcon from 'icons/send.svg';
import ForumPersonalApi from 'lib/api/ylideApi/ForumPersonalApi';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import getQueryParamString from 'lib/router/getQueryParamString';
import PopoverCompactSorting from 'ui/shared/forum/PopoverCompactSorting';
import RepliesList from 'ui/shared/forum/RepliesList';
import ReplyEntity from 'ui/shared/forum/ReplyEntity';
import SelectAccountDropdown from 'ui/shared/forum/SelectAccountDropdown';
import SelectBlockchainDropdown from 'ui/shared/forum/SelectBlockchainDropdown';
import PageTitle from 'ui/shared/Page/PageTitle';
import type { Option } from 'ui/shared/sort/Sort';

export type RepliesSortingField = RepliesSorting['sort'];
export type RepliesSortingValue = `${ RepliesSortingField }-${ RepliesSorting['order'] }`;

const SORT_OPTIONS: Array<Option<RepliesSortingValue>> = [
  { title: 'Sort by old first', id: 'time-asc' },
  { title: 'Sort by new first', id: 'time-desc' },
];

const getSortValueFromQuery = (query: Query): RepliesSortingValue => {
  if (!query.sort || !query.order) {
    return 'time-desc';
  }

  const str = query.sort + '-' + query.order;
  if (SORT_OPTIONS.map(option => option.id).includes(str)) {
    return str as RepliesSortingValue;
  }

  return 'time-desc';
};

const ContentContainer = chakra(({ children }: { children: React.ReactNode }) => {
  return (
    <Flex flexDir="column" marginX={{ base: 0, sm: -12 }} paddingX={{ base: 0, sm: 12 }}>
      { children }
    </Flex>
  );
});

const TxDiscuss = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);
  const { accounts: { initialized, domainAccounts, tokens }, broadcastMessage } = useYlide();
  const [ sorting, setSorting ] = React.useState<RepliesSortingValue>(getSortValueFromQuery(router.query));
  const [ repliesLoading, setRepliesLoading ] = React.useState(false);
  const [ replies, setReplies ] = React.useState<Array<ForumReply>>([]);
  const [ replyTo, setReplyTo ] = React.useState<ForumReply | undefined>();
  const [ thread, setThread ] = React.useState<ForumThread | undefined>();
  const [ sending, setSending ] = React.useState(false);
  const [ replyText, setReplyText ] = React.useState<string>('');
  const [ account, setAccount ] = React.useState<DomainAccount | undefined>(domainAccounts[0]);
  const [ blockchain, setBlockchain ] = React.useState<string>('GNOSIS');
  const getThread = ForumPublicApi.useGetThreadByTx(hash);
  const getReplies = ForumPublicApi.useGetReplies();
  const createThread = ForumPersonalApi.useCreateThread(tokens[0]);
  const toast = useToast();

  const replyCount = Number(thread?.replyCount || '1') - 1;
  const allRepliesLoaded = replies.length === replyCount + 1;

  useEffect(() => {
    if (!account && domainAccounts.length) {
      setAccount(domainAccounts[0]);
    } else
    if (account && domainAccounts.findIndex(d => d.account.address === account.account.address) === -1) {
      setAccount(undefined);
    }
  }, [ account, domainAccounts ]);

  const handleAccountChange = React.useCallback((newAccount: DomainAccount | undefined) => {
    setAccount(newAccount);
  }, []);

  const handleBlockchainChange = React.useCallback((newBlockchain: string) => {
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

  useEffect(() => {
    if (!initialized || !thread) {
      return;
    }
    // sorting
    const sort: [string, 'ASC' | 'DESC'] = sorting === 'time-asc' ? [ 'createTimestamp', 'ASC' ] : [ 'createTimestamp', 'DESC' ];
    setRepliesLoading(true);
    getReplies(thread.feedId, sort).then(result => {
      setReplies(result);
      setRepliesLoading(false);
      setSending(false);
      setReplyText('');
      setReplyTo(undefined);
    });
  }, [ getReplies, thread, initialized, sorting ]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    getThread().then(setThread);
  }, [ getThread, initialized ]);

  const handleSend = React.useCallback(async() => {
    if (!thread || !account) {
      return;
    }
    setSending(true);
    try {
      const ymfContent = YMF.fromPlainText(replyText);
      if (replyTo) {
        ymfContent.root.children.unshift({
          parent: ymfContent.root,
          type: 'tag',
          tag: 'reply-to',
          attributes: {
            id: replyTo.id,
          },
          singular: true,
          children: [],
        });
      }
      await broadcastMessage(account, thread.feedId, 'Reply', ymfContent);
      setTimeout(() => {
        getThread().then(setThread);
      }, 3000);
    } catch (e) {
      setSending(false);
    }
  }, [ thread, account, replyText, replyTo, broadcastMessage, getThread ]);

  const handleReplyTextChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  }, []);

  const sortings: Array<{ key: RepliesSortingValue; title: string }> = [
    { key: 'time-asc', title: 'Sort by old first' },
    { key: 'time-desc', title: 'Sort by new first' },
  ];

  const transformSortingValue = React.useCallback((value: RepliesSortingValue) => {
    return value === 'time-asc' ? 'old first' : 'new first';
  }, [ ]);

  const filteredReplies = sorting === 'time-asc' ? replies.slice(1) : replies.slice(0, -1);

  const handleReplyTo = React.useCallback((reply: ForumReply) => {
    setReplyTo(reply);
  }, [ ]);

  const handleDiscardReplyTo = React.useCallback(() => {
    setReplyTo(undefined);
  }, [ ]);

  const handleCreateDiscussion = React.useCallback(async() => {
    // blockchainAddress
    // blockchainTx
    try {
      const thread = await createThread({
        title: `Let's discuss tx "${ hash }"`,
        description: `Transaction "${ hash }" discussion`,
        blockchainTx: hash,
        topic: 'transactions',
        tags: [],
      });
      setThread(thread);
    } catch (err) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (err as ({ payload: string } | undefined))?.payload || 'There was an error while creating thread.',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [ hash, createThread, toast ]);

  const mutedColor = useColorModeValue('gray.500', 'gray.500');
  const repliesColor = useColorModeValue('gray.400', 'gray.600');
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  if (!thread) {
    return (
      <Flex flexDir="column" align="flex-start">
        <Text color={ mutedColor }>There’s no discussions about this address yet.</Text>
        <Button mt={ 4 } onClick={ handleCreateDiscussion }>Create discussion</Button>
      </Flex>
    );
  }

  return (
    <Flex flexDir="column" align="stretch">
      <ContentContainer mb={ 6 } borderBottom="1px solid" borderColor={ borderColor }>
        <Flex flexDir="column" maxW="900px">
          <HStack align="center" justify="space-between">
            <PageTitle
              isLoading={ !thread }
              afterTitle={ <Text as="span" fontSize={ 32 } ml={ 2 } color={ repliesColor }>{ replyCount }</Text> }
              title="Replies"
              justifyContent="space-between"
            />
            <PopoverCompactSorting
              items={ sortings }
              instantSelect={ true }
              onChange={ setSorting }
              value={ sorting }
              valueTransform={ transformSortingValue }
            />
          </HStack>
          { repliesLoading ? (
            <Spinner/>
          ) : (
            <RepliesList onReplyTo={ handleReplyTo } replies={ allRepliesLoaded ? filteredReplies : replies }/>
          ) }
        </Flex>
      </ContentContainer>
      <ContentContainer mb={ 6 }>
        <Flex maxW="900px" overflow="hidden" flexDir="column" border="1px solid" borderRadius={ 12 } borderColor={ borderColor }>
          { replyTo && (
            <Flex flexDir="row" borderBottom="1px solid" borderColor={ borderColor }>
              <ReplyEntity { ...replyTo } type="reply-form"/>
              <Flex flexDir="row" align="center" px={ 3 }>
                <Icon
                  as={ crossIcon }
                  boxSize={ 6 }
                  cursor="pointer"
                  _hover={{ color: 'link_hovered' }}
                  onClick={ handleDiscardReplyTo }
                />
              </Flex>
            </Flex>
          ) }
          <Flex flexDir="row" padding={ 6 } align="center" borderBottom="1px solid" borderColor={ borderColor }>
            <Textarea border="0" flexDir="row" flexGrow={ 1 } value={ replyText } placeholder="Type text here..." onChange={ handleReplyTextChange }/>
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
      </ContentContainer>
    </Flex>
  );
};

export default TxDiscuss;
