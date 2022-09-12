export interface Route {
  pattern: string;
}
export type RouteName = keyof typeof ROUTES;

const BASE_PATH = '/:network_type/:network_sub_type';

export const ROUTES = {
  tx: {
    pattern: `${ BASE_PATH }/tx/:id/:tab?`,
  },
  txs: {
    pattern: `${ BASE_PATH }/txs`,
  },
  blocks: {
    pattern: `${ BASE_PATH }/blocks`,
  },
  tokens: {
    pattern: `${ BASE_PATH }/tokens`,
  },
  apps: {
    pattern: `${ BASE_PATH }/apps`,
  },
  // ??? what URL will be here
  other: {
    pattern: `${ BASE_PATH }/other`,
  },
  watchlist: {
    pattern: `${ BASE_PATH }/account/watchlist`,
  },
  private_tags: {
    pattern: `${ BASE_PATH }/account/tag_{:tab}`,
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

if (process.env.NODE_ENV === 'development') {
  checkRoutes(ROUTES);
}
