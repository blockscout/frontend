import type { NextApiRequest, NextApiResponse } from 'next';

import fetchFactory from 'lib/api/fetch';
import getUrlWithNetwork from 'lib/api/getUrlWithNetwork';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export default function createHandler(getUrl: (_req: NextApiRequest) => string, allowedMethods: Array<Methods>) {
  const handler = async(_req: NextApiRequest, res: NextApiResponse) => {
    if (!_req.method || !allowedMethods.includes(_req.method as Methods)) {
      res.setHeader('Allow', allowedMethods);
      res.status(405).end(`Method ${ _req.method } Not Allowed`);
      return;
    }

    const isBodyDisallowed = _req.method === 'GET' || _req.method === 'HEAD';

    const url = getUrlWithNetwork(_req, `api${ getUrl(_req) }`);
    const fetch = fetchFactory(_req);
    const response = await fetch(url, {
      method: _req.method,
      body: isBodyDisallowed ? undefined : _req.body,
    });

    if (response.status === 200) {
      const data = await response.json();
      res.status(200).json(data);
      return;
    }

    let responseError;
    const defaultError = { statusText: response.statusText, status: response.status };

    try {
      const error = await response.json() as { errors: unknown };
      responseError = error?.errors || defaultError;
    } catch (error) {
      responseError = defaultError;
    }

    res.status(500).json(responseError);
  };

  return handler;
}
