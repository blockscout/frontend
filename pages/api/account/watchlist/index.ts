import type { WatchlistAddresses, WatchlistErrors } from 'types/api/account';

import handler from 'lib/api/handler';

const watchlistHandler = handler<WatchlistAddresses, WatchlistErrors>(() => '/account/v1/user/watchlist', [ 'GET', 'POST' ]);

export default watchlistHandler;
