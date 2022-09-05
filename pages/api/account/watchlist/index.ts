import handler from 'lib/api/handler';

const watchlistHandler = handler(() => '/account/v1/user/watchlist', [ 'GET', 'POST' ]);

export default watchlistHandler;
