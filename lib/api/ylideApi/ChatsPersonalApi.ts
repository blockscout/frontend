import React from 'react';

import useChatsApiFetch from './useChatsApiFetch';

const useChatsGetList = () => {
  const fetch = useChatsApiFetch();

  return React.useCallback((myAddress: string, offset = 0, limit = 100) => {
    return fetch<Array<Record<string, string>>>({
      url: '/chats',
      fetchParams: {
        method: 'POST',
        body: {
          myAddress,
          offset,
          limit,
        },
      },
    });
  }, [ fetch ]);
};

const useChatsGetMessages = () => {
  const fetch = useChatsApiFetch();

  return React.useCallback((
    myAddress: string,
    recipientAddress: string,
    offset = 0,
    limit = 100,
  ) => {
    return fetch<Array<Record<string, string>>>({
      url: '/thread',
      fetchParams: {
        method: 'POST',
        body: {
          myAddress,
          recipientAddress,
          offset,
          limit,
        },
      },
    });
  }, [ fetch ]);
};

const publicApi = {
  useGetChats: useChatsGetList,
  useGetMessages: useChatsGetMessages,
};

export default publicApi;
