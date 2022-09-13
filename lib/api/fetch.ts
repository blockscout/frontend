import type { NextApiRequest } from 'next';
import type { RequestInit, Response } from 'node-fetch';
import nodeFetch from 'node-fetch';

// first arg can be only a string
// FIXME migrate to RequestInfo later if needed
export default function fetchFactory(_req: NextApiRequest) {
  return function fetch(path: string, init?: RequestInit): Promise<Response> {
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      cookie: `_explorer_key=${ _req.cookies._explorer_key }`,
    };
    const url = `https://blockscout.com${ path }`;

    return nodeFetch(url, {
      headers,
      ...init,
    });
  };
}
