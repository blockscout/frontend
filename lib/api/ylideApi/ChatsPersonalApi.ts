import React from 'react';

import type { PaginatedArray, ForumTopic } from './types';

import { useYlide } from 'lib/contexts/ylide';

import useForumApiFetch from './useForumApiFetch';

const useChatsGetList = (tokens: Array<string>) => {
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

const publicApi = {
  useGetList: useChatsGetList,
  useGetTopics: useForumBackendGetTopics,
};

export default publicApi;
