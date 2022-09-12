export interface Route {
  pattern: string;
}
export type RouteName = keyof typeof ROUTES;

export const ROUTES = {
  tx: {
    pattern: '/:network_type/:network_sub_type/tx/:id/:tab?',
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
