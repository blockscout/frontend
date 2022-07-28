import handler from 'pages/api/utils/handler';

import type { AddressTags } from 'pages/api/types/account';

const addressHandler = handler<AddressTags>(() => '/account/v1/user/tags/address', [ 'GET', 'POST' ]);

export default addressHandler;
