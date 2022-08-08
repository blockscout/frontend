import type { NextApiRequest } from 'next';

import handler from 'pages/api/utils/handler';

const getUrl = (req: NextApiRequest) => {
  let url = `/account/v1/user/tags/transaction/${ req.query.id }`;
  if (req.method === 'PUT') {
    const params = { transaction_hash: req.query.transaction_hash as string, name: req.query.name as string };
    const searchParams = new URLSearchParams(params);
    url += `?${ searchParams.toString() }`;
  }
  return url;
};

const transactionDeleteHandler = handler(getUrl, [ 'DELETE', 'PUT' ]);

export default transactionDeleteHandler;
