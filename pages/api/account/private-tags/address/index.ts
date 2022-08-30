import type { AddressTags, AddressTagErrors } from 'types/api/account';

import handler from 'lib/api/handler';

const addressHandler = handler<AddressTags, AddressTagErrors>(() => '/account/v1/user/tags/address', [ 'GET', 'POST' ]);

export default addressHandler;
