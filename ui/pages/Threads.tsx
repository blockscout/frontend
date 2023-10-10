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
  const topicString = getQueryParamString(router.query.topic);
  const getTopic = ForumPublicApi.useGetTopic(topicString);
  const getThreads = ForumPublicApi.useGetThreads(topic?.slug || '');
  const PAGE_SIZE = 10;
  const pagination = useMemo(() => calcForumPagination(PAGE_SIZE, page, setPage, threads), [ threads, page ]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    getTopic().then(setTopic);
  }, [ getTopic, initialized ]);

  useEffect(() => {
    if (!initialized || !topic) {
      return;
    }
    setThreads(data => ({ ...data, loading: true }));
    getThreads().then(result => {
      setThreads(data => ({ ...data, loading: false, data: result }));
    }).catch(err => {
      setThreads(data => ({ ...data, loading: false, error: err }));
    });
  }, [ getThreads, initialized, topic ]);

  // const debouncedFilter = useDebounce(filter, 300);
  const globalTags = [
    'All', 'Solidity', 'Go-ethereum', 'Web3js', 'Contract-development', 'Remix', 'Blockchain',
  ];

  const onSearchChange = useCallback((value: string) => {
    // onFilterChange({ q: value });
    setFilter(value);
  }, [ ]); // onFilterChange

  const onSort = useCallback((value: ThreadsSortingValue) => {
    setSorting(value);
    // onSortingChange(getSortParamsFromValue(value));
  }, [ ]); // onSortingChange

  const filterInput = (
    <FilterInput
      w="100%"
      minW="400px"
      size="xs"
      onChange={ onSearchChange }
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
    <ActionBar mt={ -3 }>
      <HStack spacing={ 3 }>
        <PopoverSorting isActive={ false } items={ sortings } onChange={ onSort } value={ sorting }/>
        { filterInput }
      </HStack>
      <Button pos="relative" isLoading={ !topic } zIndex={ 5 } onClick={ handleCreateThread }>Create thread</Button>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  return (
    <Flex position="relative" flexDir="column">
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle
          backLink={{ label: 'Forum', url: '/forum' }}
          containerProps={{ mb: 0 }}
          title={ topic ? `Threads of "${ topic.title }"` : 'Loading...' }
          isLoading={ !topic }
          justifyContent="space-between"
        />
        <ChatsAccountsBar/>
      </HStack>
      { tags }
      { actionBar }
      { /* <ThreadsList topic={ topicString } threads={ pinnedThreads } pinned={ true }/> */ }
      <ThreadsList topic={ topicString } threads={ threads.data.items }/>
    </Flex>
  );
};

export default ThreadsPageContent;
