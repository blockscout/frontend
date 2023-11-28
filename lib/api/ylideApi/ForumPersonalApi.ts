import React from 'react';

import type { ForumThread, ForumTopic } from './types';

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

const useForumBackendBookmarkTopic = () => {
  const fetch = useYlideApiFetch();

  return React.useCallback((body: {
    token: string;
    id: string;
    enable: boolean;
  }) => {
    return fetch<ForumTopic>({
      url: '/topic/bookmark/',
      fetchParams: {
        method: 'POST',
        body: {
          id: body.id,
          enable: body.enable,
        },
      },
      tokens: body.token,
    });
  }, [ fetch ]);
};

const useForumBackendWatchTopic = () => {
  const fetch = useYlideApiFetch();

  return React.useCallback((body: {
    token: string;
    id: string;
    enable: boolean;
  }) => {
    return fetch<ForumTopic>({
      url: '/topic/watch/',
      fetchParams: {
        method: 'POST',
        body: {
          id: body.id,
          enable: body.enable,
        },
      },
      tokens: body.token,
    });
  }, [ fetch ]);
};

const useForumBackendBookmarkThread = () => {
  const fetch = useYlideApiFetch();

  return React.useCallback((body: {
    token: string;
    id: string;
    enable: boolean;
  }) => {
    return fetch<ForumThread>({
      url: '/thread/bookmark/',
      fetchParams: {
        method: 'POST',
        body: {
          id: body.id,
          enable: body.enable,
        },
      },
      tokens: body.token,
    });
  }, [ fetch ]);
};

const useForumBackendWatchThread = () => {
  const fetch = useYlideApiFetch();

  return React.useCallback((body: {
    token: string;
    id: string;
    enable: boolean;
  }) => {
    return fetch<ForumThread>({
      url: '/thread/watch/',
      fetchParams: {
        method: 'POST',
        body: {
          id: body.id,
          enable: body.enable,
        },
      },
      tokens: body.token,
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
    return fetch<ForumThread>({
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
  useBookmarkTopic: useForumBackendBookmarkTopic,
  useBookmarkThread: useForumBackendBookmarkThread,
  useWatchTopic: useForumBackendWatchTopic,
  useWatchThread: useForumBackendWatchThread,
};

export default personalApi;
