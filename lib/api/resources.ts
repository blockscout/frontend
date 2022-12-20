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
  public_tags: {
    path: '/api/account/v1/user/public_tags/:id?',
  },
  private_tags_address: {
    path: '/api/account/v1/user/tags/address/:id?',
  },
  private_tags_tx: {
    path: '/api/account/v1/user/tags/transaction/:id?',
  },

  // DEPRECATED
  old_api: {
    path: '/api',
  },
};

export const resourceKey = (x: keyof typeof RESOURCES) => x;

export interface ResourceError<T = unknown> {
  error?: T;
  payload?: T;
  status: Response['status'];
  statusText: Response['statusText'];
}

export type ResourceErrorAccount<T> = ResourceError<{ errors: T }>
