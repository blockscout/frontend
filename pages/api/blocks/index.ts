import type { NextApiRequest } from 'next';

import handler from 'lib/api/handler';

const getUrl = (req: NextApiRequest) => {
  return `/v2/blocks?type=${ req.query.type }`;
};

const requestHandler = handler(getUrl, [ 'GET' ]);

export default requestHandler;
