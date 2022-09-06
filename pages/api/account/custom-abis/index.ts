import handler from 'lib/api/handler';

const customAbiHandler = handler(() => '/account/v1/user/custom_abis', [ 'GET', 'POST' ]);

export default customAbiHandler;
