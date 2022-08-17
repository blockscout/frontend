import type { NextApiRequest, NextApiResponse } from 'next';
import nodeFetch from 'node-fetch';

import type { WatchlistAddresses } from 'types/api/account';
import type { Tokenlist } from 'types/api/tokenlist';
import type { TWatchlistItem } from 'types/client/account';

import fetch from 'lib/api/fetch';

const watchlistWithTokensHandler = async(_req: NextApiRequest, res: NextApiResponse<Array<TWatchlistItem>>) => {
  const watchlistResponse = await fetch('/account/v1/user/watchlist', { method: 'GET' });
  if (watchlistResponse.status !== 200) {
    // eslint-disable-next-line no-console
    console.error(watchlistResponse.statusText);
    res.status(500).end('Unknown error');
    return;
  }

  const watchlistData = await watchlistResponse.json() as WatchlistAddresses;

  const data = await Promise.all(watchlistData.map(async item => {
    const tokens = await nodeFetch(`https://blockscout.com/xdai/testnet/api?module=account&action=tokenlist&address=${ item.address_hash }`);

    const tokensData = await tokens.json() as Tokenlist;
    return ({ ...item, tokens_count: Array.isArray(tokensData.result) ? tokensData.result.length : 0 });
  }));

  res.status(200).json(data);
};

export default watchlistWithTokensHandler;
