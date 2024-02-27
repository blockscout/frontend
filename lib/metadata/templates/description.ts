import type { Route } from 'nextjs-routes';

// equal og:description
// eslint-disable-next-line max-len
const DEFAULT_TEMPLATE = 'Blockscout is the #1 open-source blockchain explorer available today. 100+ chains and counting rely on Blockscout data availability, APIs, and ecosystem tools to support their networks.';

// FIXME all page descriptions will be updated later
const TEMPLATE_MAP: Record<Route['pathname'], string> = {
  '/': DEFAULT_TEMPLATE,
  '/txs': DEFAULT_TEMPLATE,
  '/txs/kettle/[hash]': DEFAULT_TEMPLATE,
  '/tx/[hash]': 'View transaction %hash% on %network_title%',
  '/blocks': DEFAULT_TEMPLATE,
  '/block/[height_or_hash]': 'View the transactions, token transfers, and uncles for block %height_or_hash%',
  '/accounts': DEFAULT_TEMPLATE,
  '/address/[hash]': 'View the account balance, transactions, and other data for %hash% on the %network_title%',
  '/verified-contracts': DEFAULT_TEMPLATE,
  '/contract-verification': DEFAULT_TEMPLATE,
  '/address/[hash]/contract-verification': 'View the account balance, transactions, and other data for %hash% on the %network_title%',
  '/tokens': DEFAULT_TEMPLATE,
  '/token/[hash]': '%hash%, balances and analytics on the %network_title%',
  '/token/[hash]/instance/[id]': '%hash%, balances and analytics on the %network_title%',
  '/apps': DEFAULT_TEMPLATE,
  '/apps/[id]': DEFAULT_TEMPLATE,
  '/stats': DEFAULT_TEMPLATE,
  '/api-docs': DEFAULT_TEMPLATE,
  '/graphiql': DEFAULT_TEMPLATE,
  '/search-results': DEFAULT_TEMPLATE,
  '/auth/profile': DEFAULT_TEMPLATE,
  '/account/watchlist': DEFAULT_TEMPLATE,
  '/account/api-key': DEFAULT_TEMPLATE,
  '/account/custom-abi': DEFAULT_TEMPLATE,
  '/account/public-tags-request': DEFAULT_TEMPLATE,
  '/account/tag-address': DEFAULT_TEMPLATE,
  '/account/verified-addresses': DEFAULT_TEMPLATE,
  '/withdrawals': DEFAULT_TEMPLATE,
  '/visualize/sol2uml': DEFAULT_TEMPLATE,
  '/csv-export': DEFAULT_TEMPLATE,
  '/deposits': DEFAULT_TEMPLATE,
  '/output-roots': DEFAULT_TEMPLATE,
  '/batches': DEFAULT_TEMPLATE,
  '/batches/[number]': DEFAULT_TEMPLATE,
  '/ops': DEFAULT_TEMPLATE,
  '/op/[hash]': DEFAULT_TEMPLATE,
  '/404': DEFAULT_TEMPLATE,
  '/name-domains': DEFAULT_TEMPLATE,
  '/name-domains/[name]': DEFAULT_TEMPLATE,
  '/validators': DEFAULT_TEMPLATE,
  '/gas-tracker': DEFAULT_TEMPLATE,

  // service routes, added only to make typescript happy
  '/login': DEFAULT_TEMPLATE,
  '/api/media-type': DEFAULT_TEMPLATE,
  '/api/proxy': DEFAULT_TEMPLATE,
  '/api/csrf': DEFAULT_TEMPLATE,
  '/api/healthz': DEFAULT_TEMPLATE,
  '/auth/auth0': DEFAULT_TEMPLATE,
  '/auth/unverified-email': DEFAULT_TEMPLATE,
};

export function make(pathname: Route['pathname']) {
  const template = TEMPLATE_MAP[pathname];

  return template ?? '';
}
