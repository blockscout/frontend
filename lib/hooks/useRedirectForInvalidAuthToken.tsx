import * as Sentry from '@sentry/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { resourceKey } from 'lib/api/resources';
import * as cookies from 'lib/cookies';
import useLoginUrl from 'lib/hooks/useLoginUrl';

export interface ErrorType {
  error?: {
    status: Response['status'];
    statusText: Response['statusText'];
  };
}

export default function useRedirectForInvalidAuthToken() {
  const queryClient = useQueryClient();

  const state = queryClient.getQueryState<unknown, ErrorType>([ resourceKey('user_info') ]);
  const errorStatus = state?.error?.error?.status;
  const loginUrl = useLoginUrl();

  React.useEffect(() => {
    if (errorStatus === 401) {
      const apiToken = cookies.get(cookies.NAMES.API_TOKEN);

      if (apiToken) {
        Sentry.captureException(new Error('Invalid api token'), { tags: { source: 'fetch' } });
        window.location.assign(loginUrl);
      }
    }
  }, [ errorStatus, loginUrl ]);
}
