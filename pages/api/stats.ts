import handler from 'lib/api/handler';

const getUrl = () => '/v2/stats';

const requestHandler = handler(getUrl, [ 'GET' ]);

export default requestHandler;
