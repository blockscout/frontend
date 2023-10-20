import type { IncomingMessage } from 'http';
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
    const csrfToken = _req.headers['x-csrf-token'];
    const authToken = _req.headers['Authorization'];
    const apiToken = _req.cookies[cookies.NAMES.API_TOKEN];

    const headers = {
      accept: _req.headers['accept'] || 'application/json',
      'content-type': _req.headers['content-type'] || 'application/json',
      cookie: apiToken ? `${ cookies.NAMES.API_TOKEN }=${ apiToken }` : '',
      ...(csrfToken ? { 'x-csrf-token': String(csrfToken) } : {}),
      ...(authToken ? { Authorization: String(authToken) } : {}),
    };

    httpLogger.logger.info({
      message: 'Trying to call API',
      url,
      req: _req,
    });

    httpLogger.logger.info({
      message: 'API request headers',
      headers,
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
