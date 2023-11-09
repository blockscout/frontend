import type { Route } from 'nextjs-routes';

const TEMPLATE_MAP: Record<Route['pathname'], string> = {
  '/': 'blockchain explorer',
  '/txs': 'transactions',
  '/txs/kettle/[hash]': 'kettle %hash% transactions',
  '/tx/[hash]': 'transaction %hash%',
  '/blocks': 'blocks',
  '/block/[height_or_hash]': 'block %height_or_hash%',
  '/accounts': 'top accounts',
  '/address/[hash]': 'address details for %hash%',
  '/verified-contracts': 'verified contracts',
  '/address/[hash]/contract-verification': 'contract verification for %hash%',
  '/tokens': 'tokens',
  '/token/[hash]': '%symbol% token details',
  '/token/[hash]/instance/[id]': 'token instance for %symbol%',
  '/apps': 'apps marketplace',
  '/apps/[id]': '- %app_name%',
  '/stats': 'statistics',
  '/api-docs': 'REST API',
  '/graphiql': 'GraphQL',
  '/search-results': 'search result for %q%',
  '/auth/profile': '- my profile',
  '/account/watchlist': '- watchlist',
  '/account/api-key': '- API keys',
  '/account/custom-abi': '- custom ABI',
  '/account/public-tags-request': '- public tag requests',
  '/account/tag-address': '- private tags',
  '/account/verified-addresses': '- my verified addresses',
  '/withdrawals': 'withdrawals',
  '/visualize/sol2uml': 'Solidity UML diagram',
  '/csv-export': 'export data to CSV',
  '/l2-deposits': 'deposits (L1 > L2)',
  '/l2-output-roots': 'output roots',
  '/l2-txn-batches': 'Tx batches (L2 blocks)',
  '/l2-withdrawals': 'withdrawals (L2 > L1)',
  '/zkevm-l2-txn-batches': 'zkEvm L2 Tx batches',
  '/zkevm-l2-txn-batch/[number]': 'zkEvm L2 Tx batch %number%',
  '/404': 'error - page not found',

  // service routes, added only to make typescript happy
  '/login': 'login',
  '/api/media-type': 'node API media type',
  '/api/proxy': 'node API proxy',
  '/api/csrf': 'node API CSRF token',
  '/api/healthz': 'node API health check',
  '/auth/auth0': 'authentication',
  '/auth/unverified-email': 'unverified email',
};

export function make(pathname: Route['pathname']) {
  const template = TEMPLATE_MAP[pathname];

  return `%network_name% ${ template }`;
}
