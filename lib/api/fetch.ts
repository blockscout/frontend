import type { RequestInit, Response } from 'node-fetch';
import nodeFetch from 'node-fetch';

// first arg can be only a string
// FIXME migrate to RequestInfo later if needed
export default function fetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = {
    accept: 'application/json',
    authorization: `Bearer ${ process.env.API_AUTHORIZATION_TOKEN }`,
    'content-type': 'application/json',
  };
  const url = `https://blockscout.com${ path }`;

  return nodeFetch(url, {
    headers,
    ...init,
  });
}
