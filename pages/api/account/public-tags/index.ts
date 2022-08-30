import type { PublicTags, PublicTagErrors } from 'types/api/account';

import handler from 'lib/api/handler';

const publicKeysHandler = handler<PublicTags, PublicTagErrors>(() => '/account/v1/user/public_tags', [ 'GET', 'POST' ]);

export default publicKeysHandler;
