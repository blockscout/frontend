// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useProfileQuery from 'src/features/account/hooks/useProfileQuery';

import { useRollbar } from 'src/services/rollbar';
import * as cookies from 'src/shared/storage/cookies';

export default function useRedirectForInvalidAuthToken() {
  const rollbar = useRollbar();
  const profileQuery = useProfileQuery();
  const errorStatus = profileQuery.error?.status;

  React.useEffect(() => {
    if (errorStatus === 401) {
      const apiToken = cookies.get(cookies.NAMES.API_TOKEN);

      if (apiToken) {
        cookies.remove(cookies.NAMES.API_TOKEN);
        window.location.assign('/');
      }
    }
  }, [ errorStatus, rollbar ]);
}
