import type { PageParams } from './types';

import getNetworkTitle from 'lib/networks/getNetworkTitle';

export default function getSeo(params?: PageParams) {
  const networkTitle = getNetworkTitle(params || {});

  return {
    title: params ? `${ networkTitle } - BlockScout` : '',
  };
}
