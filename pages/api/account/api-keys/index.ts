import type { ApiKeys } from 'types/api/account';

import handler from 'lib/api/handler';

const apiKeysHandler = handler<ApiKeys>(() => '/account/v1/user/api_keys', [ 'GET', 'POST' ]);

export default apiKeysHandler;
