import type { NextApiRequest } from 'next';

import * as cookies from 'lib/cookies';

export default function getUrlWithNetwork(_req: NextApiRequest, path: string) {
  const networkType = _req.cookies[cookies.NAMES.NETWORK_TYPE];
  const networkSubType = _req.cookies[cookies.NAMES.NETWORK_SUB_TYPE];

  if (!networkType || !networkSubType) {
    // eslint-disable-next-line no-console
    console.error(`Incorrect network: NETWORK_TYPE=${ networkType } NETWORK_SUB_TYPE=${ networkSubType }`);
  }

  return `/${ networkType }/${ networkSubType }/${ path }`;
}
