import type { ApiKeys, ApiKeyErrors } from 'types/api/account';

import handler from 'lib/api/handler';

const apiKeysHandler = handler<ApiKeys, ApiKeyErrors>(() => '/account/v1/user/api_keys', [ 'GET', 'POST' ]);

export default apiKeysHandler;
