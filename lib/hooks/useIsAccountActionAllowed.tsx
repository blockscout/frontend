import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type { Route } from 'nextjs-routes';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import type { ResourceError } from 'lib/api/resources';
import { resourceKey } from 'lib/api/resources';
import useLoginUrl from 'lib/hooks/useLoginUrl';

export default function useIsAccountActionAllowed() {
  const queryClient = useQueryClient();

  const profileData = queryClient.getQueryData<UserInfo>([ resourceKey('user_info') ]);
  const profileState = queryClient.getQueryState<unknown, ResourceError<{ message: string }>>([ resourceKey('user_info') ]);
  const isAuth = Boolean(profileData);
  const loginUrl = useLoginUrl();
  const router = useRouter();

  return React.useCallback((accountRoute: Route) => {
    if (profileState?.error?.status === 403) {
      router.push(accountRoute);
      return false;
    }

    if (!isAuth) {
      window.location.assign(loginUrl);
      return false;
    }

    return true;
  }, [ isAuth, loginUrl, profileState?.error?.status, router ]);
}
