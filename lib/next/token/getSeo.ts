import type { PageParams } from './types';

import getNetworkTitle from 'lib/networks/getNetworkTitle';

export default function getSeo(params: PageParams) {
  const networkTitle = getNetworkTitle();

  return {
    title: params ? `${ params.hash } - ${ networkTitle }` : '',
    description: params ?
      `${ params.hash }, balances and analytics on the ${ networkTitle }` :
      '',
  };
}
