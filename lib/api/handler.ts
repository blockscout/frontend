import type { NextApiRequest, NextApiResponse } from 'next';

import fetch from 'lib/api/fetch';
import getUrlWithNetwork from 'lib/api/getUrlWithNetwork';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export default function handler<TRes, TErrRes>(getUrl: (_req: NextApiRequest) => string, allowedMethods: Array<Methods>) {
  return async(_req: NextApiRequest, res: NextApiResponse<TRes | TErrRes>) => {
    if (_req.method && allowedMethods.includes(_req.method as Methods)) {
      const isBodyDisallowed = _req.method === 'GET' || _req.method === 'HEAD';

      const url = getUrlWithNetwork(_req, `/api${ getUrl(_req) }`);
      const response = await fetch(url, {
        method: _req.method,
        body: isBodyDisallowed ? undefined : _req.body,
      });

      if (response.status !== 200) {
        const error = await response.json() as { errors: TErrRes };
        res.status(500).json(error?.errors || {} as TErrRes);
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
