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

const useForumBackendGetTopics = () => {
  const { accounts: { tokens } } = useYlide();
  const fetch = useForumApiFetch(tokens);

  return React.useCallback(() => {
    return fetch<PaginatedArray<ForumTopic>>({
      url: '/topic/',
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch ]);
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

const useForumBackendGetThreads = (topicSlug: string) => {
  const { accounts: { tokens } } = useYlide();
  const fetch = useForumApiFetch(tokens);

  return React.useCallback(() => {
    return fetch<PaginatedArray<ForumThread>>({
      url: `/thread/`,
      queryParams: {
        topicSlug: topicSlug,
      },
      fetchParams: {
        method: 'GET',
      },
    });
  }, [ fetch, topicSlug ]);
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

const useForumBackendGetReplies = () => {
  const { accounts: { tokens } } = useYlide();
  const fetch = useForumApiFetch(tokens);

  return React.useCallback((feedId: Uint256) => {
    return fetch<Array<ForumReply>>({
      url: `/reply/`,
      queryParams: {
        feedId: feedId,
      },
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
  useGetThread: useForumBackendGetThread,
  useGetReplies: useForumBackendGetReplies,
};

export default publicApi;
