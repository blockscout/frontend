export const ACCOUNT_ROUTES: Array<RouteName> = [ 'watchlist', 'private_tags', 'public_tags', 'api_keys', 'custom_abi' ];
import type { RouteName } from 'lib/link/routes';

export default function isAccountRoute(route: RouteName) {
  return ACCOUNT_ROUTES.includes(route);
}
