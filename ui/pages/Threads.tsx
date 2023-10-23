import { Flex, HStack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';

import type { PaginatedState, ForumTopic, ForumThread } from 'lib/api/ylideApi/types';
import { defaultPaginatedState } from 'lib/api/ylideApi/types';
import type { ThreadsSorting } from 'types/api/forum';

import type { Query } from 'nextjs-routes';

import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { calcForumPagination } from 'lib/api/ylideApi/utils';
import { useYlide } from 'lib/contexts/ylide';
import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import PopoverSorting from 'ui/shared/forum/PopoverSorting';
import TabbedTagsList from 'ui/shared/forum/TabbedTagList';
import ThreadsList from 'ui/shared/forum/ThreadsList';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import type { Option } from 'ui/shared/sort/Sort';

export type ThreadsSortingField = ThreadsSorting['sort'];
export type ThreadsSortingValue = `${ ThreadsSortingField }-${ ThreadsSorting['order'] }`;

const SORT_OPTIONS: Array<Option<ThreadsSortingValue>> = [
  { title: 'Sort by Popular asc', id: undefined },
  { title: 'Sort by Popular desc', id: 'popular-desc' },
  { title: 'Sort by Name asc', id: 'name-asc' },
  { title: 'Sort by Name desc', id: 'name-desc' },
  { title: 'Sort by Updated asc', id: 'updated-asc' },
  { title: 'Sort by Updated desc', id: 'updated-desc' },
];

const getSortValueFromQuery = (query: Query): ThreadsSortingValue => {
  if (!query.sort || !query.order) {
    return 'popular-desc';
  }

  const str = query.sort + '-' + query.order;
  if (SORT_OPTIONS.map(option => option.id).includes(str)) {
    return str as ThreadsSortingValue;
  }

  return 'popular-desc';
};

const ThreadsPageContent = () => {
  const router = useRouter();
  const { accounts: { initialized } } = useYlide();
  const [ filter, setFilter ] = React.useState<string>(router.query.q?.toString() || '');
  const [ sorting, setSorting ] = React.useState<ThreadsSortingValue>(getSortValueFromQuery(router.query));
  const [ tag, setTag ] = React.useState<string>(router.query.tag?.toString() || '');
  const [ page, setPage ] = React.useState<number>(1);
  const [ topic, setTopic ] = React.useState<ForumTopic | undefined>();
  const [ threads, setThreads ] = React.useState<PaginatedState<ForumThread>>(defaultPaginatedState());
  const [ threadsMeta, setThreadsMeta ] = React.useState<{
    pinnedThreads: Array<ForumThread>;
    topTags: Array<string>;
  }>({ pinnedThreads: [], topTags: [] });
  const topicString = getQueryParamString(router.query.topic);
  const getTopic = ForumPublicApi.useGetTopic(topicString);
  const getThreadsMeta = ForumPublicApi.useGetThreadsMeta(topicString);
  const getThreads = ForumPublicApi.useGetThreads(topic?.slug || '');
  const PAGE_SIZE = 10;
  const pagination = useMemo(() => calcForumPagination(PAGE_SIZE, page, setPage, threads), [ threads, page ]);
  const isMobile = useIsMobile();

  const debouncedFilter = useDebounce(filter, 300);

  const sortsMap: Record<ThreadsSortingValue, [string, 'ASC' | 'DESC']> = useMemo(() => ({
    'popular-asc': [ 'replyCount', 'ASC' ],
    'popular-desc': [ 'replyCount', 'DESC' ],
    'name-asc': [ 'title', 'ASC' ],
    'name-desc': [ 'title', 'DESC' ],
    'updated-asc': [ 'lastReplyTimestamp', 'ASC' ],
    'updated-desc': [ 'lastReplyTimestamp', 'DESC' ],
  }), []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    getTopic().then(setTopic);
    getThreadsMeta().then(setThreadsMeta);
  }, [ getTopic, getThreadsMeta, initialized ]);

  useEffect(() => {
    if (!initialized || !topic) {
      return;
    }
    setThreads(data => ({ ...data, loading: true }));
    const sort: [string, 'ASC' | 'DESC'] = sortsMap[sorting];
    getThreads(debouncedFilter, sort).then(result => {
      setThreads(data => ({ ...data, loading: false, data: result }));
    }).catch(err => {
      setThreads(data => ({ ...data, loading: false, error: err }));
    });
  }, [ getThreads, initialized, topic, debouncedFilter, sortsMap, sorting ]);

  const globalTags = [
    'All', 'Solidity', 'Go-ethereum', 'Web3js', 'Contract-development', 'Remix', 'Blockchain',
  ];

  const filterInput = (
    <FilterInput
      w="100%"
      minW={{ base: '100px', md: '400px' }}
      size="xs"
      onChange={ setFilter }
      placeholder="Search by type, address, hash, method..."
      initialValue={ filter }
    />
  );

  const tags = (
    <TabbedTagsList
      items={ globalTags }
      defaultValue={ tag }
      onChange={ setTag }
    />
  );

  const sortings: Array<{ key: ThreadsSortingField; title: string }> = [
    { key: 'popular', title: 'Sort by Popular' },
    { key: 'name', title: 'Sort by Name' },
    { key: 'updated', title: 'Sort by Updated' },
  ];

  const handleCreateThread = useCallback(() => {
    router.push({ pathname: '/forum/[topic]/create-thread', query: { topic: topicString } });
  }, [ router, topicString ]);

  const handleBookmarked = useCallback((threadId: string, address: string, enabled: boolean) => {
    setThreads({
      loading: false,
      error: null,
      data: {
        ...threads.data,
        items: threads.data.items.map(thread => {
          if (thread.feedId === threadId) {
            if (enabled) {
              return {
                ...thread,
                bookmarked: [ ...new Set([ ...thread.bookmarked || [], address ]).values() ],
              };
            } else {
              return {
                ...thread,
                bookmarked: thread.bookmarked ? thread.bookmarked.filter(a => a !== address) : null,
              };
            }
          }
          return thread;
        }),
      },
    });
  }, [ threads ]);

  const handleWatched = useCallback((threadId: string, address: string, enabled: boolean) => {
    setThreads({
      loading: false,
      error: null,
      data: {
        ...threads.data,
        items: threads.data.items.map(thread => {
          if (thread.feedId === threadId) {
            if (enabled) {
              return {
                ...thread,
                watched: [ ...new Set([ ...thread.watched || [], address ]).values() ],
              };
            } else {
              return {
                ...thread,
                watched: thread.watched ? thread.watched.filter(a => a !== address) : null,
              };
            }
          }
          return thread;
        }),
      },
    });
  }, [ threads ]);

  const actionBar = (
    <ActionBar mt={ -3 } flexDir={{ sm: 'row', base: 'column' }} alignItems={{ sm: 'center', base: 'stretch' }}>
      <HStack spacing={ 3 }>
        <PopoverSorting isActive={ false } items={ sortings } onChange={ setSorting } value={ sorting }/>
        { filterInput }
      </HStack>
      <Button mt={{ sm: 0, base: 3 }} pos="relative" isLoading={ !topic } zIndex={ 5 } onClick={ handleCreateThread }>Create thread</Button>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  let title = 'Loading...';
  if (topic) {
    title = isMobile ? topic.title : `Threads of "${ topic.title }"`;
  }

  return (
    <Flex position="relative" flexDir="column">
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle
          backLink={{ label: 'Forum', url: '/forum' }}
          containerProps={{ mb: 0 }}
          title={ title }
          isLoading={ !topic }
          justifyContent="space-between"
        />
        <ChatsAccountsBar/>
      </HStack>
      { tags }
      { actionBar }
      { threadsMeta.pinnedThreads.length ? (
        <ThreadsList topic={ topicString } threads={ threadsMeta.pinnedThreads } pinned={ true }/>
      ) : null }
      <ThreadsList
        topic={ topicString }
        threads={ threads.data.items }
        onBookmark={ handleBookmarked }
        onWatch={ handleWatched }
      />
    </Flex>
  );
};

export default ThreadsPageContent;
