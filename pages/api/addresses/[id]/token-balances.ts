import type { NextApiRequest } from 'next';

import handler from 'lib/api/handler';

const getUrl = (req: NextApiRequest) => {
  return `/v2/addresses/${ req.query.id }/token-balances`;
};

const requestHandler = handler(getUrl, [ 'GET' ]);

export default requestHandler;
