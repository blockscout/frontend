import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import { resourceKey } from 'lib/api/resources';
import useLoginUrl from 'lib/hooks/useLoginUrl';

export default function useIsAccountActionAllowed() {
  const queryClient = useQueryClient();

  const profileData = queryClient.getQueryData<UserInfo>([ resourceKey('user_info') ]);
  const isAuth = Boolean(profileData);
  const loginUrl = useLoginUrl();

  return React.useCallback(() => {
    if (!loginUrl) {
      return false;
    }

    if (!isAuth) {
      window.location.assign(loginUrl);
      return false;
    }

    return true;
  }, [ isAuth, loginUrl ]);
}
