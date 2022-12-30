import type { NextApiRequest } from 'next';
import type { RequestInit, Response } from 'node-fetch';
import nodeFetch from 'node-fetch';

import { httpLogger } from 'lib/api/logger';
import * as cookies from 'lib/cookies';

export default function fetchFactory(
  _req: NextApiRequest,
) {
  // first arg can be only a string
  // FIXME migrate to RequestInfo later if needed
  return function fetch(url: string, init?: RequestInit): Promise<Response> {
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      cookie: `${ cookies.NAMES.API_TOKEN }=${ _req.cookies[cookies.NAMES.API_TOKEN] }`,
    };

    httpLogger.logger.info({
      message: 'Trying to call API',
      url,
      req: _req,
    });

    return nodeFetch(url, {
      headers,
      ...init,
    });
  };
}
