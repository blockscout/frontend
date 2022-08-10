import type { NextApiRequest } from 'next';

import handler from 'pages/api/utils/handler';

const getUrl = (req: NextApiRequest) => {
  return `/account/v1/user/tags/address/${ req.query.id }`;
};

const addressDeleteHandler = handler(getUrl, [ 'DELETE', 'PUT' ]);

export default addressDeleteHandler;
