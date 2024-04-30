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
  '/token/[hash]': 'token details',
  '/token/[hash]/instance/[id]': 'NFT instance',
  '/apps': 'apps marketplace',
  '/apps/[id]': 'marketplace app',
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
  '/blobs/[hash]': 'blob %hash% details',
  '/ops': 'user operations',
  '/op/[hash]': 'user operation %hash%',
  '/404': 'error - page not found',
  '/name-domains': 'domains search and resolve',
  '/name-domains/[name]': '%name% domain details',
  '/validators': 'validators list',
  '/gas-tracker': 'gas tracker',

  // service routes, added only to make typescript happy
  '/login': 'login',
  '/api/metrics': 'node API prometheus metrics',
  '/api/log': 'node API request log',
  '/api/media-type': 'node API media type',
  '/api/proxy': 'node API proxy',
  '/api/csrf': 'node API CSRF token',
  '/api/healthz': 'node API health check',
  '/auth/auth0': 'authentication',
  '/auth/unverified-email': 'unverified email',
};

const TEMPLATE_MAP_ENHANCED: Partial<Record<Route['pathname'], string>> = {
  '/token/[hash]': '%symbol% token details',
  '/token/[hash]/instance/[id]': 'token instance for %symbol%',
  '/apps/[id]': '- %app_name%',
  '/address/[hash]': 'address details for %domain_name%',
};

export function make(pathname: Route['pathname'], isEnriched = false) {
  const template = (isEnriched ? TEMPLATE_MAP_ENHANCED[pathname] : undefined) ?? TEMPLATE_MAP[pathname];

  return `%network_name% ${ template }`;
}
