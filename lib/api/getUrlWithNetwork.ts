// import * as Sentry from '@sentry/nextjs';
import type { NextApiRequest } from 'next';

import * as cookies from 'lib/cookies';

export default function getUrlWithNetwork(_req: NextApiRequest, path: string) {
  const networkType = _req.cookies[cookies.NAMES.NETWORK_TYPE];
  const networkSubType = _req.cookies[cookies.NAMES.NETWORK_SUB_TYPE];

  // if (!networkType) {
  // TODO setup sentry for NodeJS
  // we probably do not need to if we will do api request from client directly
  //   Sentry.captureException(new Error('Incorrect network'), { extra: { networkType, networkSubType } });
  // }

  return `/${ networkType }${ networkSubType ? '/' + networkSubType : '' }/${ path }`;
}
