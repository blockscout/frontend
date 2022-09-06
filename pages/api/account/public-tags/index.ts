import handler from 'lib/api/handler';

const publicKeysHandler = handler(() => '/account/v1/user/public_tags', [ 'GET', 'POST' ]);

export default publicKeysHandler;
