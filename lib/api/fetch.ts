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
  const url = `https://${ process.env.API_HOST }${ process.env.API_BASE_PATH }${ path }`;

  return nodeFetch(url, {
    headers,
    ...init,
  });
}
