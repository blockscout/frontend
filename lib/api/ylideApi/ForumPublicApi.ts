import type { Uint256 } from '@ylide/sdk';
import React from 'react';

import type { PaginatedArray, ForumTopic, ForumThread, ForumReply } from './types';

import { useYlide } from 'lib/contexts/ylide';

import useForumApiFetch from './useForumApiFetch';

const useForumBackendGetMe = (tokens: Array<string>) => {
  const fetch = useForumApiFetch(tokens);

  return React.useCallback(() => {
    return fetch<Record<string, { isAdmin: boolean }>>({
      url: '/auth/me',
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch ]);
};

const useForumBackendGetTopics = (tokens?: Array<string>, criteria: 'all' | 'bookmarked' | 'watched' = 'all') => {
  const fetch = useForumApiFetch(tokens);

  return React.useCallback((query: string, sort: [string, 'ASC' | 'DESC'], range: [number, number]) => {
    const queryParams: Record<string, string> = query ? {
      sort: JSON.stringify(sort),
      search: query,
    } : {
      sort: JSON.stringify(sort),
    };
    if (criteria === 'bookmarked') {
      queryParams.onlyBookmarked = 'true';
    } else
    if (criteria === 'watched') {
      queryParams.onlyWatched = 'true';
    }
    queryParams.range = JSON.stringify(range);
    return fetch<PaginatedArray<ForumTopic>>({
      url: '/topic/',
      queryParams,
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch, criteria ]);
};

const useForumBackendGetTopic = (id: string) => {
  const { accounts: { tokens } } = useYlide();
  const fetch = useForumApiFetch(tokens);

  return React.useCallback(() => {
    return fetch<ForumTopic>({
      url: `/topic/${ id }`,
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch, id ]);
};

const useForumBackendGetThreads = (
  tokens?: Array<string>,
  topicSlug?: string,
  criteria: 'all' | 'bookmarked' | 'watched' = 'all',
  tag?: string,
) => {
  const fetch = useForumApiFetch(tokens);

  return React.useCallback((query: string, sort: [string, 'ASC' | 'DESC'], range: [number, number]) => {
    const queryParams: Record<string, string> = query ? {
      sort: JSON.stringify(sort),
      search: query,
    } : {
      sort: JSON.stringify(sort),
    };
    if (topicSlug) {
      queryParams.topicSlug = topicSlug;
    }
    if (criteria === 'bookmarked') {
      queryParams.onlyBookmarked = 'true';
    } else
    if (criteria === 'watched') {
      queryParams.onlyWatched = 'true';
    }
    if (tag) {
      queryParams.tags = tag;
    }
    queryParams.range = JSON.stringify(range);
    return fetch<PaginatedArray<ForumThread>>({
      url: `/thread/`,
      queryParams,
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch, topicSlug, criteria, tag ]);
};

const useForumBackendGetThreadsMeta = (topicSlug: string) => {
  const { accounts: { tokens } } = useYlide();
  const fetch = useForumApiFetch(tokens);

  return React.useCallback(() => {
    return fetch<{
      pinnedThreads: Array<ForumThread>;
      topTags: Array<{ name: string; count: string }>;
    }>({
      url: `/topic/${ topicSlug }/meta`,
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch, topicSlug ]);
};

const useForumBackendGetBestThreads = () => {
  const fetch = useForumApiFetch();

  return React.useCallback(() => {
    return fetch<{
      latest: Array<ForumThread>;
      newest: Array<ForumThread>;
      popular: Array<ForumThread>;
    }>({
      url: `/thread/best`,
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch ]);
};

const useForumBackendGetThread = (id: string) => {
  const { accounts: { tokens } } = useYlide();
  const fetch = useForumApiFetch(tokens);

  return React.useCallback(() => {
    return fetch<ForumThread>({
      url: `/thread/${ id }`,
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch, id ]);
};

const useForumBackendGetThreadByTx = (txHash: string) => {
  const { accounts: { tokens } } = useYlide();
  const fetch = useForumApiFetch(tokens);

  return React.useCallback(() => {
    return fetch<ForumThread>({
      url: `/thread//blockchain/transaction/${ txHash }`,
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch, txHash ]);
};

const useForumBackendGetThreadByAddress = (address: string) => {
  const { accounts: { tokens } } = useYlide();
  const fetch = useForumApiFetch(tokens);

  return React.useCallback(() => {
    return fetch<ForumThread>({
      url: `/thread//blockchain/address/${ address }`,
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch, address ]);
};

const useForumBackendGetReplies = () => {
  const { accounts: { tokens } } = useYlide();
  const fetch = useForumApiFetch(tokens);

  return React.useCallback((feedId: Uint256, sort: [string, 'ASC' | 'DESC']) => {
    return fetch<Array<ForumReply>>({
      url: `/reply/`,
      queryParams: {
        feedId,
        sort: JSON.stringify(sort),
      },
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch ]);
};

const useForumBackendGetReply = () => {
  const { accounts: { tokens } } = useYlide();
  const fetch = useForumApiFetch(tokens);

  return React.useCallback((id: string) => {
    return fetch<ForumReply | null>({
      url: `/reply/${ id }`,
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch ]);
};

const publicApi = {
  useGetMe: useForumBackendGetMe,

  useGetTopics: useForumBackendGetTopics,
  useGetTopic: useForumBackendGetTopic,

  useGetThreads: useForumBackendGetThreads,
  useGetThreadsMeta: useForumBackendGetThreadsMeta,
  useGetBestThreads: useForumBackendGetBestThreads,
  useGetThread: useForumBackendGetThread,
  useGetThreadByTx: useForumBackendGetThreadByTx,
  useGetThreadByAddress: useForumBackendGetThreadByAddress,

  useGetReplies: useForumBackendGetReplies,
  useGetReply: useForumBackendGetReply,
};

export default publicApi;
