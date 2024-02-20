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
  '/contract-verification': 'verify contract',
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
  '/deposits': 'deposits (L1 > L2)',
  '/output-roots': 'output roots',
  '/batches': 'tx batches (L2 blocks)',
  '/batches/[number]': 'L2 tx batch %number%',
  '/ops': 'user operations',
  '/op/[hash]': 'user operation %hash%',
  '/404': 'error - page not found',
  '/name-domains': 'domains search and resolve',
  '/name-domains/[name]': '%name% domain details',
  '/validators': 'validators list',
  '/gas-tracker': 'gas tracker',

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
