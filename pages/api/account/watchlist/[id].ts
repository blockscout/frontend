import type { NextApiRequest } from 'next';

import type { WatchlistAddresses, WatchlistErrors } from 'types/api/account';

import handler from 'lib/api/handler';

const getUrl = (req: NextApiRequest) => {
  return `/account/v1/user/watchlist/${ req.query.id }`;
};

const addressEditHandler = handler<WatchlistAddresses, WatchlistErrors>(getUrl, [ 'DELETE', 'PUT' ]);

export default addressEditHandler;
