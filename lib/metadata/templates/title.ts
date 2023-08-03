import type { Route } from 'nextjs-routes';

// TODO @tom2drum remove Partial
const TEMPLATE_MAP: Partial<Record<Route['pathname'], string>> = {
  '/txs': 'transactions',
  '/tx/[hash]': 'transaction %hash%',
};

export function make(pathname: Route['pathname']) {
  const template = TEMPLATE_MAP[pathname];

  return `%network_name% ${ template } | Blockscout`;
}
