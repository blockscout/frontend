import type { PublicTags } from 'types/api/account';

import handler from 'lib/api/handler';

const publicKeysHandler = handler<PublicTags>(() => '/account/v1/user/public_tags', [ 'GET', 'POST' ]);

export default publicKeysHandler;
