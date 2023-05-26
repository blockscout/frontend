import type { RoutedQuery } from 'nextjs-routes';

import getNetworkTitle from 'lib/networks/getNetworkTitle';

export default function getSeo(params?: RoutedQuery<'/block/[height_or_hash]'>) {
  const networkTitle = getNetworkTitle();

  const isHash = params ? params.height_or_hash.startsWith('0x') : false;

  return {
    title: params ? `Block ${ params.height_or_hash } - ${ networkTitle }` : '',
    description: params ?
      `View the transactions, token transfers, and uncles for block ${ isHash ? '' : 'number ' }${ params.height_or_hash }` : '',
  };
}
