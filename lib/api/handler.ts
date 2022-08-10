import type { NextApiRequest, NextApiResponse } from 'next';

import fetch from 'lib/api/fetch';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export default function handler<TRes>(getUrl: (_req: NextApiRequest) => string, allowedMethods: Array<Methods>) {
  return async(_req: NextApiRequest, res: NextApiResponse<TRes>) => {
    if (_req.method && allowedMethods.includes(_req.method as Methods)) {
      const isBodyDisallowed = _req.method === 'GET' || _req.method === 'HEAD';
      const response = await fetch(getUrl(_req), {
        method: _req.method,
        body: isBodyDisallowed ? undefined : _req.body,
      });

      // FIXME: add error handlers
      if (response.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(response.statusText);
        res.status(500).end('Unknown error');
        return;
      }

      const data = await response.json() as TRes;
      res.status(200).json(data);
    } else {
      res.setHeader('Allow', allowedMethods);
      res.status(405).end(`Method ${ _req.method } Not Allowed`);
    }
  };
}
