import type { IncomingMessage } from 'http';
import _pick from 'lodash/pick';
import type { NextApiRequest } from 'next';
import type { NextApiRequestCookies } from 'next/dist/server/api-utils';
import type { RequestInit, Response } from 'node-fetch';
import nodeFetch from 'node-fetch';

import { httpLogger } from 'nextjs/utils/logger';

import * as cookies from 'lib/cookies';

export default function fetchFactory(
  _req: NextApiRequest | (IncomingMessage & { cookies: NextApiRequestCookies }),
) {
  // first arg can be only a string
  // FIXME migrate to RequestInfo later if needed
  return function fetch(url: string, init?: RequestInit): Promise<Response> {
    const apiToken = _req.cookies[cookies.NAMES.API_TOKEN];

    const headers = {
      accept: _req.headers['accept'] || 'application/json',
      'content-type': _req.headers['content-type'] || 'application/json',
      cookie: apiToken ? `${ cookies.NAMES.API_TOKEN }=${ apiToken }` : '',
      ..._pick(_req.headers, [
        'x-csrf-token',
        'Authorization', // the old value, just in case
        'authorization', // Node.js automatically lowercases headers
        // feature flags
        'updated-gas-oracle',
      ]) as Record<string, string | undefined>,
    };

    httpLogger.logger.info({
      message: 'API fetch via Next.js proxy',
      url,
      // headers,
      // init,
    });

    const body = (() => {
      const _body = init?.body;
      if (!_body) {
        return;
      }

      if (typeof _body === 'string') {
        return _body;
      }

      return JSON.stringify(_body);
    })();

    return nodeFetch(url, {
      ...init,
      headers,
      body,
    });
  };
}
