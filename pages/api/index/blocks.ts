import handler from 'lib/api/handler';

const getUrl = () => '/v2/main-page/blocks';

const requestHandler = handler(getUrl, [ 'GET' ]);

export default requestHandler;
