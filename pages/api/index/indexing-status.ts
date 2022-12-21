import handler from 'lib/api/handler';

const getUrl = () => '/v2/main-page/indexing-status';

const requestHandler = handler(getUrl, [ 'GET' ]);

export default requestHandler;
