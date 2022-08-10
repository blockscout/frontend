import type { ApiKeys } from 'pages/api/types/account';

import handler from 'pages/api/utils/handler';

const apiKeysHandler = handler<ApiKeys>(() => '/account/v1/user/api_keys', [ 'GET', 'POST' ]);

export default apiKeysHandler;
