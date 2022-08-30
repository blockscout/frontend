import type { TransactionTags, TransactionTagErrors } from 'types/api/account';

import handler from 'lib/api/handler';

const transactionHandler = handler<TransactionTags, TransactionTagErrors>(() => '/account/v1/user/tags/transaction', [ 'GET', 'POST' ]);

export default transactionHandler;
