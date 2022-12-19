import type { UserInfo } from 'types/api/account';
import type { CsrfData } from 'types/client/account';

export const RESOURCES = {
  user_info: {
    path: '/api/account/v1/user/info',
    queryKey: 'user_info',
  },
  csrf: {
    path: '/api/account/v1/get_csrf',
    queryKey: 'csrf',
  },
};

export const resourceKey = (x: keyof typeof RESOURCES) => x;

export type ResourcePayload<Q extends keyof typeof RESOURCES> =
  Q extends 'user_info' ? UserInfo :
    Q extends 'csrf' ? CsrfData : never;

export interface ResourceError {
  error?: {
    status?: number;
    statusText?: string;
  };
}
