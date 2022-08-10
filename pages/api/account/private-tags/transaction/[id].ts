import type { NextApiRequest } from 'next';

import handler from 'pages/api/utils/handler';

const getUrl = (req: NextApiRequest) => {
  return `/account/v1/user/tags/transaction/${ req.query.id }`;
};

const transactionDeleteHandler = handler(getUrl, [ 'DELETE', 'PUT' ]);

export default transactionDeleteHandler;
