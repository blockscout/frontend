import type { NextApiRequest } from 'next';
import type { RequestInit, Response } from 'node-fetch';
import nodeFetch from 'node-fetch';

import appConfig from 'configs/app/config';
import { httpLogger } from 'lib/api/logger';
import * as cookies from 'lib/cookies';

// first arg can be only a string
// FIXME migrate to RequestInfo later if needed
export default function fetchFactory(
  _req: NextApiRequest,
  apiEndpoint: string = appConfig.api.endpoint,
) {
  return function fetch(path: string, init?: RequestInit): Promise<Response> {
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      cookie: `${ cookies.NAMES.API_TOKEN }=${ _req.cookies[cookies.NAMES.API_TOKEN] }`,
    };
    const url = new URL(path, apiEndpoint);

    httpLogger.logger.info({
      message: 'Trying to call API',
      url,
      req: _req,
    });

    return nodeFetch(url.toString(), {
      headers,
      ...init,
    });
  };
}
