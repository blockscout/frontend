// SPDX-License-Identifier: LicenseRef-Blockscout

import useApiQuery from 'src/api/hooks/useApiQuery';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

export default function useProfileQuery() {
  return useApiQuery('core:user_info', {
    queryOptions: {
      refetchOnMount: false,
      enabled: config.features.account.isEnabled && Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
    },
  });
}
