import {
  Flex, Icon, useColorModeValue, Text, HStack, Textarea,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';

import type { ForumReply, ForumThread } from 'lib/api/ylideApi/types';
import type { DomainAccount } from 'lib/contexts/ylide/types';
import type { RepliesSorting } from 'types/api/forum';

import type { Query } from 'nextjs-routes';

import backArrowIcon from 'icons/arrows/arrow-back.svg';
import attachmentIcon from 'icons/attachment.svg';
import bookmarkIconFilled from 'icons/bookmark_filled.svg';
import bookmarkIcon from 'icons/bookmark.svg';
import eyeIconFilled from 'icons/eye_filled.svg';
import eyeIcon from 'icons/eye.svg';
import sendIcon from 'icons/send.svg';
import ago from 'lib/ago';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import PopoverCompactSorting from 'ui/shared/forum/PopoverCompactSorting';
import RepliesList from 'ui/shared/forum/RepliesList';
import SelectAccountDropdown from 'ui/shared/forum/SelectAccountDropdown';
import SelectBlockchainDropdown from 'ui/shared/forum/SelectBlockchainDropdown';
import TagsList from 'ui/shared/forum/TagsList';
import PageTitle from 'ui/shared/Page/PageTitle';
import type { Option } from 'ui/shared/sort/Sort';

import type { ThreadsSortingField } from './Threads';

export type RepliesSortingField = RepliesSorting['sort'];
export type RepliesSortingValue = `${ RepliesSortingField }-${ RepliesSorting['order'] }`;

const SORT_OPTIONS: Array<Option<RepliesSortingValue>> = [
  { title: 'Sort by Popular asc', id: undefined },
  { title: 'Sort by Popular desc', id: 'popular-desc' },
  { title: 'Sort by Name asc', id: 'name-asc' },
  { title: 'Sort by Name desc', id: 'name-desc' },
  { title: 'Sort by Updated asc', id: 'updated-asc' },
  { title: 'Sort by Updated desc', id: 'updated-desc' },
];

const getSortValueFromQuery = (query: Query): RepliesSortingValue => {
  if (!query.sort || !query.order) {
    return 'popular-desc';
  }

  const str = query.sort + '-' + query.order;
  if (SORT_OPTIONS.map(option => option.id).includes(str)) {
    return str as RepliesSortingValue;
  }

  return 'popular-desc';
};

const ThreadPageContent = () => {
  const router = useRouter();
  const { accounts: { initialized, domainAccounts }, broadcastMessage } = useYlide();
  const [ sorting, setSorting ] = React.useState<RepliesSortingValue>(getSortValueFromQuery(router.query));

  const threadString = getQueryParamString(router.query.thread);
  // const topicString = getQueryParamString(router.query.topic);

  const [ replies, setReplies ] = React.useState<Array<ForumReply>>([]);
  const [ thread, setThread ] = React.useState<ForumThread | undefined>();
  const [ replyText, setReplyText ] = React.useState<string>('');
  const [ account, setAccount ] = React.useState<DomainAccount | undefined>(domainAccounts[0]);
  const [ blockchain, setBlockchain ] = React.useState<string>('GNOSIS');
  const getThread = ForumPublicApi.useGetThread(threadString);
  const getReplies = ForumPublicApi.useGetReplies();

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

  const handleAccountChange = useCallback((newAccount: DomainAccount | undefined) => {
    setAccount(newAccount);
  }, []);

  const handleBlockchainChange = useCallback((newBlockchain: string) => {
    setBlockchain(newBlockchain);
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    getThread().then(setThread);
  }, [ getThread, initialized ]);

  useEffect(() => {
    if (!initialized || !thread) {
      return;
    }
    getReplies(thread.feedId).then(setReplies);
  }, [ getReplies, thread, initialized ]);

  const handleSend = useCallback(async() => {
    if (!thread || !account) {
      return;
    }
    await broadcastMessage(account, thread.feedId, 'Reply', replyText);
    setTimeout(() => {
      getReplies(thread.feedId).then(setReplies);
    }, 3000);
  }, [ account, replyText, thread, broadcastMessage, getReplies ]);

  const onSort = React.useCallback((value: RepliesSortingValue) => {
    setSorting(value);
    // onSortingChange(getSortParamsFromValue(value));
  }, [ ]); // onSortingChange

  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const hoverIconColor = useColorModeValue('gray.900', 'gray.100');
  const repliesColor = useColorModeValue('gray.400', 'gray.600');
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  const isWatched = false;
  const isBookmarked = false;

  const handleReplyTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  }, []);

  const sortings: Array<{ key: ThreadsSortingField; title: string }> = [
    { key: 'popular', title: 'Sort by Popular' },
    { key: 'name', title: 'Sort by Name' },
    { key: 'updated', title: 'Sort by Updated' },
  ];

  return (
    <Flex position="relative" flexDir="column">
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle
          mb={ 0 }
          beforeTitle={ <Icon color="link" cursor="pointer" _hover={{ color: 'link_hover' }} boxSize={ 6 } mr={ 2 } as={ backArrowIcon }/> }
          title={ thread?.title || '' }
          isLoading={ !thread }
          justifyContent="space-between"
        />
        <ChatsAccountsBar compact/>
      </HStack>
      <Flex flexDir="column" mb={ 6 } borderBottom="1px solid" borderColor={ borderColor } marginX={ -12 } paddingX={ 12 }>
        <Flex flexDir="row" w="900px" mb={ 8 } justify="space-between">
          <Flex flexDir="row" gap={ 2 }>
            <Flex flexDir="row" gap={ 2 } maxW="120px">
              <AddressEntity isLoading={ !thread } address={{ hash: thread?.creatorAddress || '' }} noCopy truncation="constant"/>
            </Flex>
            <Flex title={ thread ? new Date(thread.createTimestamp * 1000).toString() : '' }>{ thread ? ago(thread.createTimestamp * 1000) : '' }</Flex>
          </Flex>
          <Flex align="center" flexDir="row" gap={ 4 }>
            <Flex><Text as="span" fontWeight="700">{ replyCount }</Text>&nbsp;{ replyCount === 1 ? 'reply' : 'replies' }</Flex>
            <Flex align="center" flexDir="row" gap={ 2 }>
              <Icon
                as={ isWatched ? eyeIconFilled : eyeIcon }
                boxSize={ 5 }
                color={ iconColor }
                cursor="pointer"
                _hover={{ color: hoverIconColor }}
              />
              <Icon
                as={ isBookmarked ? bookmarkIconFilled : bookmarkIcon }
                boxSize={ 5 }
                color={ iconColor }
                cursor="pointer"
                _hover={{ color: hoverIconColor }}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir="column" w="900px" gap={ 6 }>
          { /* <Text>Lorem ipsum dolor sit amet consectetur.</Text>
          <Text>Enim amet.</Text>
          <Image
            src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8"
            alt="random"
            borderRadius={ 12 }
            maxH="440px"
          />
          <Text>Quisque hendrerit ultricies elementum elementum turpis.</Text>
          <Text>😎 Sed dictum ultricies lectus at ut. Pretium fringilla vulputate condimentum ante sodales tristique mattis.</Text> */ }
          { thread?.description && <Text>{ thread.description }</Text> }
          <TagsList mb={ 6 } tags={ thread?.tags || [] }/>
        </Flex>
      </Flex>
      <Flex flexDir="column" mb={ 6 } borderBottom="1px solid" borderColor={ borderColor } marginX={ -12 } paddingX={ 12 }>
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
              onChange={ onSort }
              value={ sorting }
            />
          </HStack>
          <RepliesList replies={ allRepliesLoaded ? replies.slice(0, -1) : replies }/>
        </Flex>
      </Flex>
      <Flex flexDir="column" mb={ 6 } marginX={ -12 } paddingX={ 12 }>
        <Flex w="900px" flexDir="column" border="1px solid" borderRadius={ 12 } borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }>
          <Flex flexDir="row" padding={ 6 } align="center" borderBottom="1px solid" borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }>
            <Textarea border="0" flexDir="row" flexGrow={ 1 } value={ replyText } placeholder="Type text here..." onChange={ handleReplyTextChange }/>
            <Flex flexDir="row" align="center"><Icon as={ attachmentIcon } boxSize={ 6 }/></Flex>
          </Flex>

          <Flex flexDir="row" justify="space-between" padding={ 6 }>
            <SelectAccountDropdown
              value={ account }
              onChange={ handleAccountChange }
            />
            <Flex flexDir="row" align="center" gap={ 6 }>
              <SelectBlockchainDropdown
                options={ [ 'GNOSIS', 'ETHEREUM', 'BNBCHAIN' ] }
                value={ blockchain }
                onChange={ handleBlockchainChange }
              />
              <Flex flexDir="row" align="center">
                <Icon as={ sendIcon } boxSize={ 6 } cursor="pointer" _hover={{ color: 'link_hovered' }} onClick={ handleSend }/>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ThreadPageContent;
