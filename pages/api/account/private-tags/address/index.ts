import type { AddressTags } from 'pages/api/types/account';

import handler from 'pages/api/utils/handler';

const addressHandler = handler<AddressTags>(() => '/account/v1/user/tags/address', [ 'GET', 'POST' ]);

export default addressHandler;
