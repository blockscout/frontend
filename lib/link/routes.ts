import appConfig from 'configs/app/config';

import PATHS from './paths.json';

export interface Route {
  pattern: string;
  crossNetworkNavigation?: boolean; // route will not change when switching networks
}

export type RouteName = keyof typeof ROUTES;

export const ROUTES = {
  // NETWORK MAIN PAGE
  // todo_tom need full url builder
  network_index: {
    pattern: PATHS.network_index,
    crossNetworkNavigation: true,
  },

  // ACCOUNT
  // watchlist: {
  //   pattern: PATHS.watchlist,
  // },
  // private_tags: {
  //   pattern: PATHS.private_tags,
  // },
  // public_tags: {
  //   pattern: PATHS.public_tags,
  // },
  // api_keys: {
  //   pattern: PATHS.api_keys,
  // },
  // custom_abi: {
  //   pattern: PATHS.custom_abi,
  // },
  // profile: {
  //   pattern: PATHS.profile,
  // },

  // TRANSACTIONS
  // txs: {
  //   pattern: PATHS.txs,
  //   crossNetworkNavigation: true,
  // },

  // todo_tom need full url builder
  tx: {
    pattern: PATHS.tx,
  },

  // BLOCKS
  // blocks: {
  //   pattern: PATHS.blocks,
  //   crossNetworkNavigation: true,
  // },
  // block: {
  //   pattern: PATHS.block,
  // },

  // TOKENS
  tokens: {
    pattern: PATHS.tokens,
    crossNetworkNavigation: true,
  },
  token_index: {
    pattern: PATHS.token_index,
    crossNetworkNavigation: true,
  },
  token_instance_item: {
    pattern: PATHS.token_instance_item,
  },

  // ADDRESSES
  address_index: {
    pattern: PATHS.address_index,
    crossNetworkNavigation: true,
  },
  address_contract_verification: {
    pattern: PATHS.address_contract_verification,
    crossNetworkNavigation: true,
  },

  // ACCOUNTS
  accounts: {
    pattern: PATHS.accounts,
    crossNetworkNavigation: true,
  },

  // APPS
  apps: {
    pattern: PATHS.apps,
  },
  app_index: {
    pattern: PATHS.app_index,
  },

  stats: {
    pattern: PATHS.stats,
  },

  // SEARCH
  search_results: {
    pattern: PATHS.search_results,
  },

  // VISUALIZE
  visualize_sol2uml: {
    pattern: PATHS.visualize_sol2uml,
  },

  csv_export: {
    pattern: PATHS.csv_export,
  },

  // AUTH
  auth: {
    pattern: PATHS.auth,
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
