import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';

import type { PaginatedState, ForumThread } from 'lib/api/ylideApi/types';
import { defaultPaginatedState } from 'lib/api/ylideApi/types';
import type { ThreadsSorting } from 'types/api/forum';

import type { Query } from 'nextjs-routes';

import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { calcForumPagination } from 'lib/api/ylideApi/utils';
import { useYlide } from 'lib/contexts/ylide';
import useDebounce from 'lib/hooks/useDebounce';
import ThreadsList from 'ui/shared/forum/ThreadsList';
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

const useThreadsContent = (tokens?: Array<string>, topicSlug?: string, criteria: 'all' | 'bookmarked' | 'watched' = 'all', tag?: string) => {
  const router = useRouter();
  const { accounts: { initialized } } = useYlide();
  const [ filter, setFilter ] = React.useState<string>(router.query.q?.toString() || '');
  const [ sorting, setSorting ] = React.useState<ThreadsSortingValue>(getSortValueFromQuery(router.query));
  const [ page, setPage ] = React.useState<number>(1);
  const [ threads, setThreads ] = React.useState<PaginatedState<ForumThread>>(defaultPaginatedState());
  const getThreads = ForumPublicApi.useGetThreads(tokens, topicSlug || '', criteria, tag);
  const PAGE_SIZE = 10;
  const pagination = useMemo(() => calcForumPagination(PAGE_SIZE, page, setPage, threads), [ threads, page ]);

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
    setThreads(data => ({ ...data, loading: true }));
    const sort: [string, 'ASC' | 'DESC'] = sortsMap[sorting];
    getThreads(debouncedFilter, sort, [ (page - 1) * PAGE_SIZE, page * PAGE_SIZE ]).then(result => {
      setThreads(data => ({ ...data, loading: false, data: result }));
    }).catch(err => {
      setThreads(data => ({ ...data, loading: false, error: err }));
    });
  }, [ getThreads, initialized, debouncedFilter, sortsMap, sorting, page ]);

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

  return {
    filter,
    setFilter,
    sorting,
    setSorting,
    pagination,
    content: useMemo(() => (
      <ThreadsList
        threads={ threads.data.items }
        onBookmark={ handleBookmarked }
        onWatch={ handleWatched }
      />
    ), [ threads, handleBookmarked, handleWatched ]),
  };
};

export default useThreadsContent;
