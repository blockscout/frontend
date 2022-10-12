export interface Route {
  pattern: string;
  crossNetworkNavigation?: boolean; // route will not change when switching networks
}

import appConfig from 'configs/app/config';

export type RouteName = keyof typeof ROUTES;

const BASE_PATH = '/[network_type]/[network_sub_type]';

export const ROUTES = {
  // NETWORK MAIN PAGE
  network_index: {
    pattern: `${ BASE_PATH }`,
    crossNetworkNavigation: true,
  },

  // ACCOUNT
  watchlist: {
    pattern: `${ BASE_PATH }/account/watchlist`,
  },
  private_tags: {
    pattern: `${ BASE_PATH }/account/tag_address`,
  },
  public_tags: {
    pattern: `${ BASE_PATH }/account/public_tags_request`,
  },
  api_keys: {
    pattern: `${ BASE_PATH }/account/api_key`,
  },
  custom_abi: {
    pattern: `${ BASE_PATH }/account/custom_abi`,
  },
  profile: {
    pattern: `${ BASE_PATH }/auth/profile`,
  },

  // TRANSACTIONS
  txs: {
    pattern: `${ BASE_PATH }/txs`,
    crossNetworkNavigation: true,
  },
  tx: {
    pattern: `${ BASE_PATH }/tx/[id]`,
  },

  // BLOCKS
  blocks: {
    pattern: `${ BASE_PATH }/blocks`,
    crossNetworkNavigation: true,
  },
  block: {
    pattern: `${ BASE_PATH }/block/[id]`,
  },

  // TOKENS
  tokens: {
    pattern: `${ BASE_PATH }/tokens`,
    crossNetworkNavigation: true,
  },
  token_index: {
    pattern: `${ BASE_PATH }/token/[id]`,
    crossNetworkNavigation: true,
  },

  // ADDRESSES
  address_index: {
    pattern: `${ BASE_PATH }/address/[id]`,
    crossNetworkNavigation: true,
  },
  address_contract_verification: {
    pattern: `${ BASE_PATH }/address/[id]/contract_verifications/new`,
    crossNetworkNavigation: true,
  },

  // APPS
  apps: {
    pattern: `${ BASE_PATH }/apps`,
  },
  app_index: {
    pattern: `${ BASE_PATH }/apps/[id]`,
  },

  // SEARCH
  search_results: {
    pattern: `${ BASE_PATH }/apps`,
  },

  // ??? what URL will be here
  other: {
    pattern: `${ BASE_PATH }/search-results`,
  },

  // AUTH
  auth: {
    // no slash required, it is correct
    pattern: `${ BASE_PATH }auth/auth0`,
  },
};

// !!! for development purpose only !!!
// don't wanna strict ROUTES to type "Record<string, Route>"
// otherwise we lose benefit of using "keyof typeof ROUTES" for possible route names (it will be any string then)
// but we still want typescript to tell us if routes follow its interface
// so we do this simple type-checking here
//
// another option is to create common enum with all possible route names and use it across the project
// but it is a little bit overwhelming as it seems right now
function checkRoutes(route: Record<string, Route>) {
  return route;
}

if (appConfig.isDev) {
  checkRoutes(ROUTES);
}
