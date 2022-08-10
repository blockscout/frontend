import type { AddressTags } from 'types/api/account';

import handler from 'pages/api/utils/handler';

const addressHandler = handler<AddressTags>(() => '/account/v1/user/tags/address', [ 'GET', 'POST' ]);

export default addressHandler;
