import type { PageParams } from './types';

import getNetworkTitle from 'lib/networks/getNetworkTitle';

export default function getSeo(params?: PageParams) {
  const networkTitle = getNetworkTitle();

  return {
    title: params ? `Block ${ params.id } - ${ networkTitle }` : '',
    description: params ? `View the transactions, token transfers, and uncles for block number ${ params.id }` : '',
  };
}
