import handler from 'lib/api/handler';

const getUrl = () => '/v2/stats/charts/market';

const requestHandler = handler(getUrl, [ 'GET' ]);

export default requestHandler;
