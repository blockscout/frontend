import type { PageParams } from './types';

import getNetworkTitle from 'lib/networks/getNetworkTitle';

export default function getSeo(params?: PageParams) {
  const networkTitle = getNetworkTitle(params || {});

  return {
    title: params ? `Transaction ${ params.id } - ${ networkTitle }` : '',
    description: params ? `View transaction ${ params.id } on ${ networkTitle }` : '',
  };
}
