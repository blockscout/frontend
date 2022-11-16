import handler from 'lib/api/handler';

const getUrl = () => '/v2/stats/charts/transactions';

const requestHandler = handler(getUrl, [ 'GET' ]);

export default requestHandler;
