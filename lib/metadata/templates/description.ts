import type { Route } from 'nextjs-routes';

// TODO @tom2drum remove Partial
// FIXME all page descriptions will be updated later
const TEMPLATE_MAP: Partial<Record<Route['pathname'], string>> = {
  '/txs': '',
  '/tx/[hash]': 'View transaction %hash% on %network_title%',
};

export function make(pathname: Route['pathname']) {
  const template = TEMPLATE_MAP[pathname];

  return template ?? '';
}
