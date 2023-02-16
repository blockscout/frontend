import type { RoutedQuery } from 'nextjs-routes';

import getNetworkTitle from 'lib/networks/getNetworkTitle';

export default function getSeo(params: RoutedQuery<'/address/[hash]'>) {
  const networkTitle = getNetworkTitle();

  return {
    title: params ? `${ params.hash } - ${ networkTitle }` : '',
    description: params ?
      `View the account balance, transactions, and other data for ${ params.hash } on the ${ networkTitle }` :
      '',
  };
}
