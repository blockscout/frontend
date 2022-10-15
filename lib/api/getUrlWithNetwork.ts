// import * as Sentry from '@sentry/nextjs';
import appConfig from 'configs/app/config';
import type { NextApiRequest } from 'next';

export default function getUrlWithNetwork(_req: NextApiRequest, path: string) {
  return [
    appConfig.api.basePath,
    path,
  ].filter(Boolean).join('');
}
