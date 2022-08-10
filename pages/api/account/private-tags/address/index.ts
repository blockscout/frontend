import type { AddressTags } from 'types/api/account';

import handler from 'lib/api/handler';

const addressHandler = handler<AddressTags>(() => '/account/v1/user/tags/address', [ 'GET', 'POST' ]);

export default addressHandler;
