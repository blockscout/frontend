import type { NextApiRequest } from 'next';

import handler from 'pages/api/utils/handler';

const getUrl = (req: NextApiRequest) => {
  return `/account/v1/user/api_keys/${ req.query.id }`;
};

const apiKeysHandler = handler(getUrl, [ 'DELETE', 'PUT' ]);

export default apiKeysHandler;
