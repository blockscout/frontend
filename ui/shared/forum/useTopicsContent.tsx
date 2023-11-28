import { Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';

import { type PaginatedState, type ForumTopic, defaultPaginatedState } from 'lib/api/ylideApi/types';
import type { TopicsSorting } from 'types/api/forum';

import type { Query } from 'nextjs-routes';

import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { calcForumPagination } from 'lib/api/ylideApi/utils';
import { useYlide } from 'lib/contexts/ylide';
import useDebounce from 'lib/hooks/useDebounce';
import TopicsList from 'ui/shared/forum/TopicsList';
import type { Option } from 'ui/shared/sort/Sort';

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

const useTopicsContent = (tokens?: Array<string>, criteria: 'all' | 'bookmarked' | 'watched' = 'all') => {
  const router = useRouter();
  const { accounts: { initialized } } = useYlide();
  const [ reloadTick, setReloadTick ] = React.useState<number>(0);
  const [ filter, setFilter ] = React.useState<string>(router.query.q?.toString() || '');
  const [ sorting, setSorting ] = React.useState<TopicsSortingValue>(getSortValueFromQuery(router.query));
  const [ page, setPage ] = React.useState<number>(1);
  const [ topics, setTopics ] = React.useState<PaginatedState<ForumTopic>>(defaultPaginatedState());
  const getTopics = ForumPublicApi.useGetTopics(tokens, criteria);
  const PAGE_SIZE = 10;
  const pagination = useMemo(() => calcForumPagination(PAGE_SIZE, page, setPage, topics), [ topics, page ]);

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
    const sort: [string, 'ASC' | 'DESC'] = sortsMap[sorting];
    getTopics(debouncedFilter, sort, [ (page - 1) * PAGE_SIZE, page * PAGE_SIZE ]).then(result => {
      setTopics(data => ({ ...data, loading: false, data: result }));
    }).catch(err => {
      setTopics(data => ({ ...data, loading: false, error: err }));
    });
  }, [ getTopics, initialized, debouncedFilter, sorting, sortsMap, reloadTick, page ]);

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

  return {
    filter,
    setFilter,
    sorting,
    setSorting,
    reloadTick,
    setReloadTick,
    pagination,
    content: useMemo(() => (
      topics.loading ? (
        <Spinner/>
      ) : (
        <TopicsList
          topics={ topics.data.items }
          onBookmark={ handleBookmarked }
          onWatch={ handleWatched }
        />
      )
    ), [ topics, handleBookmarked, handleWatched ]),
  };
};

export default useTopicsContent;
