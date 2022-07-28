import type { NextApiRequest, NextApiResponse } from 'next'

import fetch from './fetch';

type Methods = 'GET' | 'POST' | 'DELETE';

export default function handler<TRes>(getUrl: (_req: NextApiRequest) => string, allowedMethods: Array<Methods>) {
  return async(_req: NextApiRequest, res: NextApiResponse<TRes>) => {
    if (_req.method === 'GET' && allowedMethods.includes('GET')) {
      const response = await fetch(getUrl(_req))
      const data = await response.json() as TRes;

      res.status(200).json(data);
    } else if (allowedMethods.includes('POST') && _req.method === 'POST') {
      const response = await fetch(getUrl(_req), {
        method: 'POST',
        body: _req.body,
      })
      const data = await response.json() as TRes;

      res.status(200).json(data)
    } else if (allowedMethods.includes('DELETE') && _req.method === 'DELETE') {
      const response = await fetch(getUrl(_req), { method: 'DELETE' });
      // FIXME: add error handlers
      if (response.status !== 200) {
        // eslint-disable-next-line no-console
        console.log(response.statusText);
      }
      res.status(200).end();
    } else {
      res.setHeader('Allow', allowedMethods)
      res.status(405).end(`Method ${ _req.method } Not Allowed`)
    }
  }
}
