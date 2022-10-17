// import * as Sentry from '@sentry/nextjs';
import type { NextApiRequest } from 'next';

import appConfig from 'configs/app/config';

export default function getUrlWithNetwork(_req: NextApiRequest, path: string) {
  return [
    appConfig.api.basePath,
    path,
  ]
    .filter((segment) => segment !== '' && segment !== '/')
    .join('');
}
