import type { IMessage } from '@ylide/sdk';
import React from 'react';

import { DEFAULT_CHAINS } from 'ui/shared/forum/SelectBlockchainDropdown';

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
          msgId: string;
          metadata: Omit<IMessage, 'key'> & { key: Array<number> };
          isSentByYou: boolean;
          lastMessageTimestamp: number;
        }>;
      };
    }>({
      url: '/v2/chats',
      fetchParams: {
        method: 'POST',
        body: {
          myAddress,
          offset,
          limit,
          blockchain: DEFAULT_CHAINS,
        },
      },
    }).then(response => ({
      ...response,
      data: {
        ...response.data,
        entries: response.data.entries.map(e => ({
          ...e,
          metadata: {
            ...e.metadata,
            key: new Uint8Array(e.metadata.key),
          },
        })),
      },
    }));
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
      url: '/v2/thread',
      fetchParams: {
        method: 'POST',
        body: {
          myAddress,
          recipientAddress,
          offset,
          limit,
          blockchain: DEFAULT_CHAINS,
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
