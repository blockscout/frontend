import { Flex, HStack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';

import type { ForumTopic, ForumThread } from 'lib/api/ylideApi/types';

import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import PopoverSorting from 'ui/shared/forum/PopoverSorting';
import TabbedTagsList from 'ui/shared/forum/TabbedTagList';
import ThreadsList from 'ui/shared/forum/ThreadsList';
import type { ThreadsSortingField } from 'ui/shared/forum/useThreadsContent';
import useThreadsContent from 'ui/shared/forum/useThreadsContent';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';

const ThreadsPageContent = () => {
  const router = useRouter();
  const { accounts: { initialized, tokens } } = useYlide();
  const [ tag, setTag ] = React.useState<string>(router.query.tag?.toString() || 'All');
  const [ topic, setTopic ] = React.useState<ForumTopic | undefined>();
  const [ threadsMeta, setThreadsMeta ] = React.useState<{
    pinnedThreads: Array<ForumThread>;
    topTags: Array<{ name: string; count: string }>;
  }>({ pinnedThreads: [], topTags: [] });
  const topicString = getQueryParamString(router.query.topic);
  const getTopic = ForumPublicApi.useGetTopic(topicString);
  const getThreadsMeta = ForumPublicApi.useGetThreadsMeta(topicString);
  const isMobile = useIsMobile();
  const {
    filter,
    setFilter,
    sorting,
    setSorting,
    pagination,
    content,
  } = useThreadsContent(tokens, topicString, tag === 'bookmarked' ? 'bookmarked' : 'all', tag === 'All' || tag === 'bookmarked' ? undefined : tag);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    getTopic().then(setTopic);
    getThreadsMeta().then(setThreadsMeta);
  }, [ getTopic, getThreadsMeta, initialized ]);

  const globalTags = useMemo(() => [ 'All', ...threadsMeta.topTags.map(tag => tag.name) ], [ threadsMeta ]);

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

  const actionBar = (
    <ActionBar mt={ -3 } flexDir={{ sm: 'row', base: 'column' }} alignItems={{ sm: 'center', base: 'stretch' }}>
      <HStack spacing={ 3 }>
        <PopoverSorting isActive={ false } items={ sortings } onChange={ setSorting } value={ sorting }/>
        { filterInput }
      </HStack>
      { topicString !== 'transactions' && topicString !== 'addresses' ? (
        <Button mt={{ sm: 0, base: 3 }} pos="relative" isLoading={ !topic } zIndex={ 5 } onClick={ handleCreateThread }>Create thread</Button>
      ) : null }
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
        <ThreadsList threads={ threadsMeta.pinnedThreads } pinned={ true }/>
      ) : null }
      { content }
    </Flex>
  );
};

export default ThreadsPageContent;
