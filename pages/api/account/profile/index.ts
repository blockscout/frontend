import type { UserInfo } from 'types/api/account';

import handler from 'lib/api/handler';

const profileHandler = handler<UserInfo, unknown>(() => '/account/v1/user/info', [ 'GET' ]);

export default profileHandler;
