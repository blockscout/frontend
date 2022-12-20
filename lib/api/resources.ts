import type { UserInfo, CustomAbis } from 'types/api/account';
import type { CsrfData } from 'types/client/account';

export const RESOURCES = {
  // account
  user_info: {
    path: '/api/account/v1/user/info',
  },
  csrf: {
    path: '/api/account/v1/get_csrf',
  },
  custom_abi: {
    path: '/api/account/v1/user/custom_abis/:id?',
  },
  watchlist: {
    path: '/api/account/v1/user/watchlist/:id?',
  },

  // DEPRECATED
  old_api: {
    path: '/api',
  },
};

export const resourceKey = (x: keyof typeof RESOURCES) => x;

export type ResourcePayload<Q extends keyof typeof RESOURCES> =
  Q extends 'user_info' ? UserInfo :
    Q extends 'csrf' ? CsrfData :
      Q extends 'custom_abi' ? CustomAbis :
        never;

export interface ResourceError<T = unknown> {
  error?: T;
  payload?: T;
  status: Response['status'];
  statusText: Response['statusText'];
}
