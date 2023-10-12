import {
  Flex, Icon, useColorModeValue, Text, HStack, Textarea, Spinner,
} from '@chakra-ui/react';
import { EVMNetwork, EVM_CHAINS, EVM_NAMES } from '@ylide/ethereum';
import { YMF } from '@ylide/sdk';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';

import type { ForumReply, ForumThread } from 'lib/api/ylideApi/types';
import type { DomainAccount } from 'lib/contexts/ylide/types';
import type { RepliesSorting } from 'types/api/forum';

import type { Query } from 'nextjs-routes';

import attachmentIcon from 'icons/attachment.svg';
import bookmarkIconFilled from 'icons/bookmark_filled.svg';
import bookmarkIcon from 'icons/bookmark.svg';
import crossIcon from 'icons/cross.svg';
import eyeIconFilled from 'icons/eye_filled.svg';
import eyeIcon from 'icons/eye.svg';
import sendIcon from 'icons/send.svg';
import ago from 'lib/ago';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import Editor from 'ui/shared/forum/Editor';
import PopoverCompactSorting from 'ui/shared/forum/PopoverCompactSorting';
import RepliesList from 'ui/shared/forum/RepliesList';
import ReplyEntity from 'ui/shared/forum/ReplyEntity';
import SelectAccountDropdown from 'ui/shared/forum/SelectAccountDropdown';
import SelectBlockchainDropdown from 'ui/shared/forum/SelectBlockchainDropdown';
import TagsList from 'ui/shared/forum/TagsList';
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

const ThreadPageContent = () => {
  const router = useRouter();
  const { accounts: { initialized, domainAccounts }, broadcastMessage } = useYlide();
  const [ sorting, setSorting ] = React.useState<RepliesSortingValue>(getSortValueFromQuery(router.query));

  const threadString = getQueryParamString(router.query.thread);
  // const topicString = getQueryParamString(router.query.topic);

  const [ repliesLoading, setRepliesLoading ] = React.useState(false);
  const [ replies, setReplies ] = React.useState<Array<ForumReply>>([]);
  const [ replyTo, setReplyTo ] = React.useState<ForumReply | undefined>();
  const [ thread, setThread ] = React.useState<ForumThread | undefined>();
  const [ sending, setSending ] = React.useState(false);
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
    if (!initialized) {
      return;
    }
    getThread().then(setThread);
  }, [ getThread, initialized ]);

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
  }, [ getReplies, thread, initialized, replyCount, sorting ]);

  const handleSend = useCallback(async() => {
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

  const sortings: Array<{ key: RepliesSortingValue; title: string }> = [
    { key: 'time-asc', title: 'Sort by old first' },
    { key: 'time-desc', title: 'Sort by new first' },
  ];

  const transformSortingValue = useCallback((value: RepliesSortingValue) => {
    return value === 'time-asc' ? 'old first' : 'new first';
  }, [ ]);

  const filteredReplies = sorting === 'time-asc' ? replies.slice(1) : replies.slice(0, -1);

  const handleReplyTo = useCallback((reply: ForumReply) => {
    setReplyTo(reply);
  }, [ ]);

  const handleDiscardReplyTo = useCallback(() => {
    setReplyTo(undefined);
  }, [ ]);

  return (
    <Flex position="relative" flexDir="column">
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle
          mb={ 0 }
          backLink={ thread ? { url: `/forum/${ thread.topicSlug }`, label: `Back to topic` } : undefined }
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
          { thread?.description && (
            <Editor
              value={ thread.description }
            />
          ) }
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
              instantSelect={ true }
              onChange={ onSort }
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
      </Flex>
      <Flex flexDir="column" mb={ 6 } marginX={ -12 } paddingX={ 12 }>
        <Flex w="900px" overflow="hidden" flexDir="column" border="1px solid" borderRadius={ 12 } borderColor={ borderColor }>
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
          <Flex flexDir="row" padding={ 6 } align="center" borderBottom="1px solid" borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }>
            <Textarea border="0" flexDir="row" flexGrow={ 1 } value={ replyText } placeholder="Type text here..." onChange={ handleReplyTextChange }/>
            <Flex flexDir="row" align="center">
              <Icon
                as={ attachmentIcon }
                boxSize={ 6 }
                cursor="pointer"
                _hover={{ color: 'link_hovered' }}
              />
            </Flex>
          </Flex>

          <Flex flexDir="row" justify="space-between" padding={ 6 }>
            <SelectAccountDropdown
              value={ account }
              onChange={ handleAccountChange }
            />
            <Flex flexDir="row" align="center" gap={ 6 }>
              <SelectBlockchainDropdown
                value={ blockchain }
                onChange={ handleBlockchainChange }
              />
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
    </Flex>
  );
};

export default ThreadPageContent;
