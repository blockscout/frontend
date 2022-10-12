import appConfig from 'configs/app/config';
import type { NextApiRequest } from 'next';
import type { RequestInit, Response } from 'node-fetch';
import nodeFetch from 'node-fetch';

import * as cookies from 'lib/cookies';

// first arg can be only a string
// FIXME migrate to RequestInfo later if needed
export default function fetchFactory(_req: NextApiRequest) {
  return function fetch(path: string, init?: RequestInit): Promise<Response> {
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      cookie: `${ cookies.NAMES.API_TOKEN }=${ _req.cookies[cookies.NAMES.API_TOKEN] }`,
    };
    const url = new URL(path, appConfig.apiUrl);

    return nodeFetch(url.toString(), {
      headers,
      ...init,
    });
  };
}
