import type { RoutedQuery } from 'nextjs-routes';

import getNetworkTitle from 'lib/networks/getNetworkTitle';

export default function getSeo(params?: RoutedQuery<'/block/[height]'>) {
  const networkTitle = getNetworkTitle();

  return {
    title: params ? `Block ${ params.height } - ${ networkTitle }` : '',
    description: params ? `View the transactions, token transfers, and uncles for block number ${ params.height }` : '',
  };
}
