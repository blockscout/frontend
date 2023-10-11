import type { IMessage } from '@ylide/sdk';
import React from 'react';

import useChatsApiFetch from './useChatsApiFetch';

const useChatsGetList = () => {
  const fetch = useChatsApiFetch();

  return React.useCallback((myAddress: string, offset = 0, limit = 100) => {
    return fetch<{
      result: true;
      data: {
        totalCount: string;
        entries: Array<{
          address: string;
          lastMessageTimestamp: number;
        }>;
      };
    }>({
      url: '/nft3-chats',
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
    return fetch<{
      result: true;
      data: {
        totalCount: string;
        entries: Array<{
          id: string;
          type: 'message';
          isIncoming: boolean;
          msg: IMessage;
        }>;
      };
    }>({
      url: '/nft3-thread',
      fetchParams: {
        method: 'POST',
        body: {
          myAddress,
          recipientAddress,
          offset,
          limit,
        },
      },
    }).then(result => {
      if (result.result) {
        return {
          ...result,
          data: {
            ...result.data,
            entries: result.data.entries.map(m => ({
              ...m,
              msg: {
                ...m.msg,
                key: new Uint8Array(m.msg.key),
              },
            })),
          },
        };
      } else {
        return result;
      }
    });
  }, [ fetch ]);
};

const publicApi = {
  useGetChats: useChatsGetList,
  useGetMessages: useChatsGetMessages,
};

export default publicApi;
