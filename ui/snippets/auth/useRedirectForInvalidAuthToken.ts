import * as Sentry from '@sentry/react';
import React from 'react';

import * as cookies from 'lib/cookies';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

export default function useRedirectForInvalidAuthToken() {
  const profileQuery = useProfileQuery();
  const errorStatus = profileQuery.error?.status;

  React.useEffect(() => {
    if (errorStatus === 401) {
      const apiToken = cookies.get(cookies.NAMES.API_TOKEN);

      if (apiToken) {
        Sentry.captureException(new Error('Invalid API token'), { tags: { source: 'invalid_api_token' } });
        cookies.remove(cookies.NAMES.API_TOKEN);
        window.location.assign('/');
      }
    }
  }, [ errorStatus ]);
}
