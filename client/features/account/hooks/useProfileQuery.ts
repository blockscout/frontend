// SPDX-License-Identifier: LicenseRef-Blockscout

import useApiQuery from 'client/api/hooks/useApiQuery';

import config from 'client/config';
import * as cookies from 'client/shared/storage/cookies';

export default function useProfileQuery() {
  return useApiQuery('general:user_info', {
    queryOptions: {
      refetchOnMount: false,
      enabled: config.features.account.isEnabled && Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
    },
  });
}
