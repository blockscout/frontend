// SPDX-License-Identifier: LicenseRef-Blockscout

import useApiQuery from 'client/api/hooks/useApiQuery';

import * as cookies from 'client/shared/storage/cookies';

import config from 'configs/app';

export default function useProfileQuery() {
  return useApiQuery('general:user_info', {
    queryOptions: {
      refetchOnMount: false,
      enabled: config.features.account.isEnabled && Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
    },
  });
}
