import { Flex, HStack, Button } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { ForumThread } from 'lib/api/ylideApi/types';

import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import { CreateTopicModal } from 'ui/createTopicModal';
import { TabSwitcher } from 'ui/selectWalletModal/TabSwitcher';
import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import DevForumHero from 'ui/shared/forum/DevForumHero';
import PopoverSorting from 'ui/shared/forum/PopoverSorting';
import ThreadsHighlight from 'ui/shared/forum/ThreadsHighlight';
import type { TopicsSortingField, TopicsSortingValue } from 'ui/shared/forum/useTopicsContent';
import useTopicsContent from 'ui/shared/forum/useTopicsContent';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';

const ThreadsHighlights = ({
  // latest,
  newest,
  popular,
}: {
  latest: Array<ForumThread>;
  newest: Array<ForumThread>;
  popular: Array<ForumThread>;
}) => {
  const [ tab, setTab ] = useState<'pinned' | 'popular' | 'freshest'>('pinned');
  const isMobile = useIsMobile();

  return (
    <>
      { isMobile ? (
        <TabSwitcher
          tabs={ [
            {
              key: 'pinned',
              label: 'Pinned',
            },
            {
              key: 'popular',
              label: 'Popular',
            },
            {
              key: 'freshest',
              label: 'Freshest',
            },
          ] }
          selected={ tab }
          onSelect={ setTab }
        />
      ) : null }
      <Flex
        mb={ 10 }
        flexDir="row"
        columnGap={ 3 }
        alignItems="flex-start"
        maxW="100%"
      >
        { !isMobile || tab === 'pinned' ? (
          <ThreadsHighlight title="📌 Pinned" items={ popular }/>
        ) : null }
        { !isMobile || tab === 'popular' ? (
          <ThreadsHighlight title="🔥 Most popular" items={ popular }/>
        ) : null }
        { !isMobile || tab === 'freshest' ? (
          <ThreadsHighlight title="❤️ Most freshest" items={ newest }/>
        ) : null }
      </Flex>
    </>
  );
};

const TopicsPageContent = () => {
  const isMobile = useIsMobile();
  const { accounts: { admins, tokens, initialized } } = useYlide();
  const [ createTopicVisible, setCreateTopicVisible ] = React.useState(false);
  const [ bestThreads, setBestThreads ] = React.useState<{
    latest: Array<ForumThread>;
    newest: Array<ForumThread>;
    popular: Array<ForumThread>;
  }>({ latest: [], newest: [], popular: [] });
  const getBestThreads = ForumPublicApi.useGetBestThreads();
  const {
    filter,
    setFilter,
    sorting,
    setSorting,
    reloadTick,
    setReloadTick,
    pagination,
    content,
  } = useTopicsContent(tokens, 'all');

  const handleCreateTopicClose = useCallback(() => {
    setReloadTick(tick => tick + 1);
    setCreateTopicVisible(false);
  }, [ setReloadTick ]);

  const handleCreateTopicOpen = useCallback(() => {
    setCreateTopicVisible(true);
  }, [ ]);

  const debouncedFilter = useDebounce(filter, 300);
  // sorting

  const sortsMap: Record<TopicsSortingValue, [string, 'ASC' | 'DESC']> = useMemo(() => ({
    'popular-asc': [ 'threadsCount', 'ASC' ],
    'popular-desc': [ 'threadsCount', 'DESC' ],
    'name-asc': [ 'title', 'ASC' ],
    'name-desc': [ 'title', 'DESC' ],
    'updated-asc': [ 'lastReplyTimestamp', 'ASC' ],
    'updated-desc': [ 'lastReplyTimestamp', 'DESC' ],
  }), []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    if (reloadTick < 0) {
      return;
    }
    getBestThreads().then(result => {
      setBestThreads(result);
    }).catch(() => {
    });
  }, [ getBestThreads, initialized, debouncedFilter, sorting, sortsMap, reloadTick ]);

  const filterInput = (
    <FilterInput
      w="100%"
      minW={ isMobile ? undefined : '400px' }
      flexGrow={ 1 }
      size="xs"
      onChange={ setFilter }
      placeholder="Search by type, address, hash, method..."
      initialValue={ filter }
    />
  );

  const sortings: Array<{ key: TopicsSortingField; title: string }> = [
    { key: 'popular', title: 'Sort by Popular' },
    { key: 'name', title: 'Sort by Name' },
    { key: 'updated', title: 'Sort by Updated' },
  ];

  const PopoverSortingTyped = PopoverSorting<TopicsSortingField, TopicsSortingValue>;

  const actionBar = (
    <ActionBar mt={ -3 } flexDir={{ sm: 'row', base: 'column' }} alignItems={{ sm: 'center', base: 'stretch' }}>
      <HStack spacing={ 3 } alignItems={{ sm: 'center', base: 'stretch' }}>
        <PopoverSortingTyped
          isActive={ sorting !== 'popular-desc' }
          items={ sortings }
          onChange={ setSorting }
          value={ sorting }
        />
        { filterInput }
      </HStack>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  return (
    <>
      { createTopicVisible ? (
        <CreateTopicModal onClose={ handleCreateTopicClose }/>
      ) : null }
      <Flex position="relative" flexDir="column">
        <DevForumHero/>
        <HStack align="center" justify="space-between" mb={ 6 }>
          <PageTitle containerProps={{ mb: 0 }} title="Dev forum" justifyContent="space-between"/>
          <ChatsAccountsBar/>
        </HStack>
        <ThreadsHighlights { ...bestThreads }/>
        <HStack align="center" justify="space-between" mb={ 6 }>
          <PageTitle containerProps={{ mb: 0 }} title="Topics" justifyContent="space-between"/>
          { admins.length ? (<Button pos="relative" onClick={ handleCreateTopicOpen }>Create topic</Button>) : null }
        </HStack>
        { actionBar }
        { content }
      </Flex>
    </>
  );
};

export default TopicsPageContent;
