import handler from 'lib/api/handler';

const transactionHandler = handler(() => '/account/v1/user/tags/transaction', [ 'GET', 'POST' ]);

export default transactionHandler;
