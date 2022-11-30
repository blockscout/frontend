import type { PageParams } from './types';

import getNetworkTitle from 'lib/networks/getNetworkTitle';

export default function getSeo(params: PageParams) {
  const networkTitle = getNetworkTitle();

  return {
    title: params ? `${ params.id } - ${ networkTitle }` : '',
    description: params ?
      `View the account balance, transactions, and other data for ${ params.id } on the ${ networkTitle }` :
      '',
  };
}
