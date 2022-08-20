import type { NextApiRequest } from 'next';

import handler from 'lib/api/handler';

const getUrl = (req: NextApiRequest) => {
  return `/account/v1/user/custom_abis/${ req.query.id }`;
};

const customAbiHandler = handler(getUrl, [ 'DELETE', 'PUT' ]);

export default customAbiHandler;
