import type { NextApiRequest } from 'next';

import handler from 'lib/api/handler';

const getUrl = (req: NextApiRequest) => {
  return `/account/v1/user/public_tags/${ req.query.id }`;
};

const publicTagsHandler = handler(getUrl, [ 'DELETE', 'PUT' ]);

export default publicTagsHandler;
