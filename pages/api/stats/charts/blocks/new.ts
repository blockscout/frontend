import type { NextApiRequest } from 'next';

import appConfig from 'configs/app/config';
import handler from 'lib/api/handler';

const getUrl = (req: NextApiRequest) => {
  const { from, to } = req.query;
  return `/v1/blocks/new?${ from ? `&from=${ from }&to=${ to }` : '' }`;
};

const requestHandler = handler(getUrl, [ 'GET' ], appConfig.statsApi.endpoint);

export default requestHandler;
