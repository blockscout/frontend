import type { NextApiRequest } from 'next';

import handler from 'lib/api/handler';

const getUrl = (req: NextApiRequest) => {
  const searchParams: Record<string, string> = {};
  Object.entries(req.query).forEach(([ key, value ]) => {
    searchParams[key] = Array.isArray(value) ? value.join(',') : (value || '');
  });
  const searchParamsStr = new URLSearchParams(searchParams).toString();
  return `/v2/transactions/${ searchParamsStr ? '?' + searchParamsStr : '' }`;
};

const requestHandler = handler(getUrl, [ 'GET' ]);

export default requestHandler;
