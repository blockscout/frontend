// todo_tom leave only one api endpoint
import handler from 'lib/api/handler';

const getUrl = () => '/v2/stats';

const requestHandler = handler(getUrl, [ 'GET' ]);

export default requestHandler;
