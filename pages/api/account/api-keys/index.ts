import handler from 'lib/api/handler';

const apiKeysHandler = handler(() => '/account/v1/user/api_keys', [ 'GET', 'POST' ]);

export default apiKeysHandler;
