import type { Route } from 'nextjs-routes';

type OGPageType = 'Homepage' | 'Root page' | 'Regular page';

const OG_TYPE_DICT: Record<Route['pathname'], OGPageType> = {
  '/': 'Homepage',
  '/txs': 'Root page',
  '/txs/kettle/[hash]': 'Regular page',
  '/tx/[hash]': 'Regular page',
  '/blocks': 'Root page',
  '/block/[height_or_hash]': 'Regular page',
  '/accounts': 'Root page',
  '/address/[hash]': 'Regular page',
  '/verified-contracts': 'Root page',
  '/address/[hash]/contract-verification': 'Regular page',
  '/tokens': 'Root page',
  '/token/[hash]': 'Regular page',
  '/token/[hash]/instance/[id]': 'Regular page',
  '/apps': 'Root page',
  '/apps/[id]': 'Regular page',
  '/stats': 'Root page',
  '/api-docs': 'Regular page',
  '/graphiql': 'Regular page',
  '/search-results': 'Regular page',
  '/auth/profile': 'Root page',
  '/account/watchlist': 'Regular page',
  '/account/api-key': 'Regular page',
  '/account/custom-abi': 'Regular page',
  '/account/public-tags-request': 'Regular page',
  '/account/tag-address': 'Regular page',
  '/account/verified-addresses': 'Root page',
  '/withdrawals': 'Root page',
  '/visualize/sol2uml': 'Regular page',
  '/csv-export': 'Regular page',
  '/l2-deposits': 'Root page',
  '/l2-output-roots': 'Root page',
  '/l2-txn-batches': 'Root page',
  '/l2-withdrawals': 'Root page',
  '/zkevm-l2-txn-batches': 'Root page',
  '/zkevm-l2-txn-batch/[number]': 'Regular page',
  '/404': 'Regular page',

  // service routes, added only to make typescript happy
  '/login': 'Regular page',
  '/api/media-type': 'Regular page',
  '/api/proxy': 'Regular page',
  '/api/csrf': 'Regular page',
  '/api/healthz': 'Regular page',
  '/auth/auth0': 'Regular page',
  '/auth/unverified-email': 'Regular page',
};

export default function getPageOgType(pathname: Route['pathname']) {
  return OG_TYPE_DICT[pathname];
}
