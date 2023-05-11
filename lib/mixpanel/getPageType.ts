import type { Route } from 'nextjs-routes';

const PAGE_TYPE_DICT: Record<Route['pathname'], string> = {
  '/': 'Homepage',
  '/txs': 'Transactions',
  '/tx/[hash]': 'Transaction details',
  '/blocks': 'Blocks',
  '/block/[height]': 'Block details',
  '/accounts': 'Top accounts',
  '/address/[hash]': 'Address details',
  '/verified-contracts': 'Verified contracts',
  '/address/[hash]/contract_verification': 'Contract verification',
  '/tokens': 'Tokens',
  '/token/[hash]': 'Token details',
  '/token/[hash]/instance/[id]': 'Token Instance',
  '/apps': 'Apps',
  '/apps/[id]': 'App',
  '/stats': 'Stats',
  '/api-docs': 'REST API',
  '/graphiql': 'GraphQL',
  '/search-results': 'Search results',
  '/auth/profile': 'Profile',
  '/account/watchlist': 'Watchlist',
  '/account/api_key': 'API keys',
  '/account/custom_abi': 'Custom ABI',
  '/account/public_tags_request': 'Public tags',
  '/account/tag_address': 'Private tags',
  '/withdrawals': 'Withdrawals',
  '/visualize/sol2uml': 'Solidity UML diagram',
  '/csv-export': 'Export data to CSV file',
  '/l2-deposits': 'Deposits (L1 > L2)',
  '/l2-output-roots': 'Output roots',
  '/l2-txn-batches': 'Tx batches (L2 blocks)',
  '/l2-withdrawals': 'Withdrawals (L2 > L1)',

  // service routes, added only to make typescript happy
  '/login': 'Login',
  '/api/media-type': 'Node API: Media type',
  '/api/proxy': 'Node API: Proxy',
  '/api/csrf': 'Node API: CSRF token',
  '/auth/auth0': 'Auth',
  '/graph': 'Graph',
};

export default function getPageType(pathname: Route['pathname']) {
  return PAGE_TYPE_DICT[pathname] || 'Unknown page';
}
