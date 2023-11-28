import React from 'react';

import useTelegramApiFetch from './useTelegramApiFetch';

const useForumTelegramGetLink = () => {
  const fetch = useTelegramApiFetch();

  return React.useCallback((
    addresses: Array<string>,
  ) => {
    return fetch<{
      result: true;
      data: string;
    }>({
      url: `/get-link?${ addresses.map(address => `addresses=${ encodeURIComponent(address) }`).join('&') }`,
      fetchParams: {
        method: 'GET',
      },
    }).then(res => res.data);
  }, [ fetch ]);
};

const forumTelegramApi = {
  useGetLink: useForumTelegramGetLink,
};

export default forumTelegramApi;
