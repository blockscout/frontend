import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import { resourceKey } from 'lib/api/resources';
import useLoginUrl from 'lib/hooks/useLoginUrl';

export default function useRedirectIfNotAuth() {
  const queryClient = useQueryClient();

  const profileData = queryClient.getQueryData<UserInfo>([ resourceKey('user_info') ]);
  const isAuth = Boolean(profileData);
  const loginUrl = useLoginUrl();

  return React.useCallback(() => {
    if (!isAuth) {
      window.location.assign(loginUrl);
      return true;
    }

    return false;
  }, [ isAuth, loginUrl ]);
}
