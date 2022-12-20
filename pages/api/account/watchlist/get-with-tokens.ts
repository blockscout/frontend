import type { NextApiRequest, NextApiResponse } from 'next';

import type { WatchlistAddresses } from 'types/api/account';
import type { Tokenlist } from 'types/api/tokenlist';
import type { TWatchlistItem } from 'types/client/account';

import fetchFactory from 'lib/api/fetch';
import getUrlWithNetwork from 'lib/api/getUrlWithNetwork';
import { httpLogger } from 'lib/api/logger';

const watchlistWithTokensHandler = async(_req: NextApiRequest, res: NextApiResponse<Array<TWatchlistItem>>) => {
  httpLogger(_req, res);

  const fetch = fetchFactory(_req);
  const url = getUrlWithNetwork(_req, '/api/account/v1/user/watchlist');
  const watchlistResponse = await fetch(url, { method: 'GET' });

  const watchlistData = await watchlistResponse.json() as WatchlistAddresses;

  if (watchlistResponse.status !== 200) {
    httpLogger.logger.error({ err: { statusText: 'Watchlist token error', status: 500 }, url: _req.url });
    res.status(500).end(watchlistData || 'Unknown error');
    return;
  }

  const data = await Promise.all(watchlistData.map(async item => {
    const tokens = await fetch(`/api/?module=account&action=tokenlist&address=${ item.address_hash }`);

    const tokensData = await tokens.json() as Tokenlist;
    return ({ ...item, tokens_count: Array.isArray(tokensData.result) ? tokensData.result.length : 0 });
  }));

  res.status(200).json(data);
};

export default watchlistWithTokensHandler;
