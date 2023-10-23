import { Flex, HStack, Button, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { ForumThread } from 'lib/api/ylideApi/types';
import { type PaginatedState, type ForumTopic, defaultPaginatedState } from 'lib/api/ylideApi/types';
import type { TopicsSorting } from 'types/api/forum';

import type { Query } from 'nextjs-routes';

import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { calcForumPagination } from 'lib/api/ylideApi/utils';
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
import TopicsList from 'ui/shared/forum/TopicsList';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import type { Option } from 'ui/shared/sort/Sort';
// import { generateListStub } from 'stubs/utils';
// import { TOKEN_INFO_ERC_20 } from 'stubs/token';
// import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

// import type { RoutedTab } from 'ui/shared/Tabs/types';

// import useIsMobile from 'lib/hooks/useIsMobile';
// import getQueryParamString from 'lib/router/getQueryParamString';
// import { BLOCK } from 'stubs/block';
// import { generateListStub } from 'stubs/utils';
// import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
// import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';

// const TAB_LIST_PROPS = {
//   marginBottom: 0,
//   py: 5,
//   marginTop: -5,
// };

export type TopicsSortingField = TopicsSorting['sort'];
export type TopicsSortingValue = `${ TopicsSortingField }-${ TopicsSorting['order'] }`;

const SORT_OPTIONS: Array<Option<TopicsSortingValue>> = [
  { title: 'Sort by Popular asc', id: undefined },
  { title: 'Sort by Popular desc', id: 'popular-desc' },
  { title: 'Sort by Name asc', id: 'name-asc' },
  { title: 'Sort by Name desc', id: 'name-desc' },
  { title: 'Sort by Updated asc', id: 'updated-asc' },
  { title: 'Sort by Updated desc', id: 'updated-desc' },
];

const getSortValueFromQuery = (query: Query): TopicsSortingValue => {
  if (!query.sort || !query.order) {
    return 'popular-desc';
  }

  const str = query.sort + '-' + query.order;
  if (SORT_OPTIONS.map(option => option.id).includes(str)) {
    return str as TopicsSortingValue;
  }

  return 'popular-desc';
};

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
          <ThreadsHighlight title="🔥 Pinned" items={ popular }/>
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
  const router = useRouter();
  const isMobile = useIsMobile();
  const { accounts: { admins, initialized } } = useYlide();
  const [ reloadTick, setReloadTick ] = React.useState<number>(0);
  const [ filter, setFilter ] = React.useState<string>(router.query.q?.toString() || '');
  const [ sorting, setSorting ] = React.useState<TopicsSortingValue>(getSortValueFromQuery(router.query));
  const [ page, setPage ] = React.useState<number>(1);
  const [ topics, setTopics ] = React.useState<PaginatedState<ForumTopic>>(defaultPaginatedState());
  const [ createTopicVisible, setCreateTopicVisible ] = React.useState(false);
  const [ bestThreads, setBestThreads ] = React.useState<{
    latest: Array<ForumThread>;
    newest: Array<ForumThread>;
    popular: Array<ForumThread>;
  }>({ latest: [], newest: [], popular: [] });
  const getTopics = ForumPublicApi.useGetTopics();
  const getBestThreads = ForumPublicApi.useGetBestThreads();
  const PAGE_SIZE = 10;
  const pagination = useMemo(() => calcForumPagination(PAGE_SIZE, page, setPage, topics), [ topics, page ]);

  const handleCreateTopicClose = useCallback(() => {
    setReloadTick(tick => tick + 1);
    setCreateTopicVisible(false);
  }, []);

  const handleCreateTopicOpen = useCallback(() => {
    setCreateTopicVisible(true);
  }, []);

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
    setTopics(data => ({ ...data, loading: true }));
    getBestThreads().then(result => {
      setBestThreads(result);
    }).catch(() => {
    });
    const sort: [string, 'ASC' | 'DESC'] = sortsMap[sorting];
    getTopics(debouncedFilter, sort).then(result => {
      setTopics(data => ({ ...data, loading: false, data: result }));
    }).catch(err => {
      setTopics(data => ({ ...data, loading: false, error: err }));
    });
  }, [ getTopics, getBestThreads, initialized, debouncedFilter, sorting, sortsMap, reloadTick ]);

  const onSearchChange = useCallback((value: string) => {
    setFilter(value);
  }, [ ]);

  const onSort = useCallback((value: TopicsSortingValue) => {
    setSorting(value);
  }, [ ]);

  const handleBookmarked = useCallback((topicId: string, address: string, enabled: boolean) => {
    setTopics({
      loading: false,
      error: null,
      data: {
        ...topics.data,
        items: topics.data.items.map(topic => {
          if (topic.id === topicId) {
            if (enabled) {
              return {
                ...topic,
                bookmarked: [ ...new Set([ ...topic.bookmarked || [], address ]).values() ],
              };
            } else {
              return {
                ...topic,
                bookmarked: topic.bookmarked ? topic.bookmarked.filter(a => a !== address) : null,
              };
            }
          }
          return topic;
        }),
      },
    });
  }, [ topics ]);

  const handleWatched = useCallback((topicId: string, address: string, enabled: boolean) => {
    setTopics({
      loading: false,
      error: null,
      data: {
        ...topics.data,
        items: topics.data.items.map(topic => {
          if (topic.id === topicId) {
            if (enabled) {
              return {
                ...topic,
                watched: [ ...new Set([ ...topic.watched || [], address ]).values() ],
              };
            } else {
              return {
                ...topic,
                watched: topic.watched ? topic.watched.filter(a => a !== address) : null,
              };
            }
          }
          return topic;
        }),
      },
    });
  }, [ topics ]);

  const filterInput = (
    <FilterInput
      w="100%"
      minW={ isMobile ? undefined : '400px' }
      flexGrow={ 1 }
      size="xs"
      onChange={ onSearchChange }
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
          onChange={ onSort }
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
          <ChatsAccountsBar compact={ true }/>
        </HStack>
        <ThreadsHighlights { ...bestThreads }/>
        <HStack align="center" justify="space-between" mb={ 6 }>
          <PageTitle containerProps={{ mb: 0 }} title="Topics" justifyContent="space-between"/>
          { admins.length ? (<Button pos="relative" onClick={ handleCreateTopicOpen }>Create topic</Button>) : null }
        </HStack>
        { actionBar }
        { topics.loading ? (
          <Spinner/>
        ) : (
          <TopicsList
            topics={ topics.data.items }
            onBookmark={ handleBookmarked }
            onWatch={ handleWatched }
          />
        ) }
      </Flex>
    </>
  );
};

export default TopicsPageContent;
