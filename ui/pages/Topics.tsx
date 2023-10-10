import { Flex, HStack, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';

import { type PaginatedState, type ForumTopic, defaultPaginatedState } from 'lib/api/ylideApi/types';
import type { TopicsSorting } from 'types/api/forum';

import type { Query } from 'nextjs-routes';

import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { calcForumPagination } from 'lib/api/ylideApi/utils';
import { useYlide } from 'lib/contexts/ylide';
import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import DevForumHero from 'ui/shared/forum/DevForumHero';
import PopoverSorting from 'ui/shared/forum/PopoverSorting';
import TopicsHighlight from 'ui/shared/forum/TopicsHighlight';
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

const TopicsHighlights = () => {
  return (
    <Flex
      mb={ 10 }
      flexDir="row"
      columnGap={ 3 }
      alignItems="flex-start"
      maxW="100%"
    >
      <TopicsHighlight title="🔥 Most popular" items={ [
        { id: '123',
          title: 'One of the most popular thread name here' },
        { id: '456',
          title: 'One of the most popular thread name here' },
        { id: '789',
          title: 'One of the most popular thread name here' },
      ] }/>
      <TopicsHighlight title="💬 Top commented" items={ [
        { id: '123',
          title: 'One of the most popular thread name here' },
        { id: '456',
          title: 'One of the most popular thread name here' },
        { id: '789',
          title: 'One of the most popular thread name here' },
      ] }/>
      <TopicsHighlight title="❤️ Most freshest" items={ [
        { id: '123',
          title: 'One of the most popular thread name here' },
        { id: '456',
          title: 'One of the most popular thread name here' },
        { id: '789',
          title: 'One of the most popular thread name here' },
      ] }/>
    </Flex>
  );
};

const TopicsPageContent = () => {
  const router = useRouter();
  const { accounts: { admins, initialized } } = useYlide();
  const [ filter, setFilter ] = React.useState<string>(router.query.q?.toString() || '');
  const [ sorting, setSorting ] = React.useState<TopicsSortingValue>(getSortValueFromQuery(router.query));
  const [ page, setPage ] = React.useState<number>(1);
  const [ topics, setTopics ] = React.useState<PaginatedState<ForumTopic>>(defaultPaginatedState());
  const getTopics = ForumPublicApi.useGetTopics();
  const PAGE_SIZE = 10;
  const pagination = useMemo(() => calcForumPagination(PAGE_SIZE, page, setPage, topics), [ topics, page ]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    setTopics(data => ({ ...data, loading: true }));
    getTopics().then(result => {
      setTopics(data => ({ ...data, loading: false, data: result }));
    }).catch(err => {
      setTopics(data => ({ ...data, loading: false, error: err }));
    });
  }, [ getTopics, initialized ]);

  // const debouncedFilter = useDebounce(filter, 300);

  const onSearchChange = useCallback((value: string) => {
    // onFilterChange({ q: value });
    setFilter(value);
  }, [ ]); // onFilterChange

  const onSort = useCallback((value: TopicsSortingValue) => {
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

  const sortings: Array<{ key: TopicsSortingField; title: string }> = [
    { key: 'popular', title: 'Sort by Popular' },
    { key: 'name', title: 'Sort by Name' },
    { key: 'updated', title: 'Sort by Updated' },
  ];

  const PopoverSortingTyped = PopoverSorting<TopicsSortingField, TopicsSortingValue>;

  const actionBar = (
    <ActionBar mt={ -3 }>
      <HStack spacing={ 3 }>
        <PopoverSortingTyped isActive={ sorting !== 'popular-desc' } items={ sortings } onChange={ onSort } value={ sorting }/>
        { filterInput }
      </HStack>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  return (
    <Flex position="relative" flexDir="column">
      <DevForumHero/>
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle containerProps={{ mb: 0 }} title="Dev forum" justifyContent="space-between"/>
        <ChatsAccountsBar compact={ true }/>
      </HStack>
      <TopicsHighlights/>
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle containerProps={{ mb: 0 }} title="Topics" justifyContent="space-between"/>
        { admins.length ? (<Button pos="relative">Create topic</Button>) : null }
      </HStack>
      { actionBar }
      { topics.loading ? 'Loading...' : (
        <TopicsList topics={ topics.data.items }/>
      ) }
    </Flex>
  );
};

export default TopicsPageContent;
