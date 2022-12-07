import appConfig from 'configs/app/config';
import handler from 'lib/api/handler';

const getUrl = () => '/v1/counters';

const requestHandler = handler(getUrl, [ 'GET' ], appConfig.statsApi.endpoint);

export default requestHandler;
