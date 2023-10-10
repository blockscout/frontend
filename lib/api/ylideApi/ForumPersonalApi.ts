import React from 'react';

import type { ForumThreadCompact, ForumTopic } from './types';

import useYlideApiFetch from './useForumApiFetch';

const useForumBackendAcquireAuthKey = () => {
  const fetch = useYlideApiFetch();

  return React.useCallback((body: {
    messageEncrypted: string;
    publicKey: string;
    address: string;
  }) => {
    return fetch<{ token: string }>({
      url: '/auth/',
      fetchParams: {
        method: 'POST',
        body,
      },
    }).then(({ token }: { token: string }) => token);
  }, [ fetch ]);
};

const useForumBackendCreateTopic = (token: string) => {
  const fetch = useYlideApiFetch(token);

  return React.useCallback((body: {
    title: string;
    description: string;
    adminOnly: boolean;
  }) => {
    return fetch<ForumTopic>({
      url: '/topic/',
      fetchParams: {
        method: 'POST',
        body,
      },
    });
  }, [ fetch ]);
};

export interface ThreadCreateParams {
  topic: string;
  title: string;
  description: string;

  parentFeedId?: string;
  tags: Array<string>;
  blockchainAddress?: string;
  blockchainTx?: string;
  comissions?: string;
}

const useForumBackendCreateThread = (token: string) => {
  const fetch = useYlideApiFetch(token);

  return React.useCallback((body: ThreadCreateParams) => {
    return fetch<ForumThreadCompact>({
      url: '/thread/',
      fetchParams: {
        method: 'POST',
        body,
      },
    });
  }, [ fetch ]);
};

const personalApi = {
  useAcquireAuthKey: useForumBackendAcquireAuthKey,
  useCreateTopic: useForumBackendCreateTopic,
  useCreateThread: useForumBackendCreateThread,
};

export default personalApi;
