import type { RoutedQuery } from 'nextjs-routes';

import getNetworkTitle from 'lib/networks/getNetworkTitle';

export default function getSeo(params?: RoutedQuery<'/tx/[hash]'>) {
  const networkTitle = getNetworkTitle();

  return {
    title: params ? `Transaction ${ params.hash } - ${ networkTitle }` : '',
    description: params ? `View transaction ${ params.hash } on ${ networkTitle }` : '',
  };
}
