export const ACCOUNT_ROUTES = [ '/watchlist', '/tag_address', '/tag_transaction', '/public_tags_request', '/api_key', '/custom_abi' ];

export default function isAccountRoute(route: string) {
  return ACCOUNT_ROUTES.includes(route);
}
