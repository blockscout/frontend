import handler from 'lib/api/handler';

const getUrl = () => '/v2/main-page/transactions';

const requestHandler = handler(getUrl, [ 'GET' ]);

export default requestHandler;
