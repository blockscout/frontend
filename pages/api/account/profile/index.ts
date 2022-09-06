import handler from 'lib/api/handler';

const profileHandler = handler(() => '/account/v1/user/info', [ 'GET' ]);

export default profileHandler;
