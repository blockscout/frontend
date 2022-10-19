import handler from 'lib/api/handler';

const getUrl = () => {
  return `/v2/config/json-rpc-url`;
};

const requestHandler = handler(getUrl, [ 'GET' ]);

export default requestHandler;
