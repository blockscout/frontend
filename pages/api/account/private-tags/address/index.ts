import handler from 'lib/api/handler';

const addressHandler = handler(() => '/account/v1/user/tags/address', [ 'GET', 'POST' ]);

export default addressHandler;
