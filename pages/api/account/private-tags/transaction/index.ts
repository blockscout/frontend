import type { TransactionTags } from 'pages/api/types/account';

import handler from 'pages/api/utils/handler';

const transactionHandler = handler<TransactionTags>(() => '/account/v1/user/tags/transaction', [ 'GET', 'POST' ]);

export default transactionHandler;
