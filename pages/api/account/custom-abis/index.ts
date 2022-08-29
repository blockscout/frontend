import type { CustomAbis, CustomAbiErrors } from 'types/api/account';

import handler from 'lib/api/handler';

const customAbiHandler = handler<CustomAbis, CustomAbiErrors>(() => '/account/v1/user/custom_abis', [ 'GET', 'POST' ]);

export default customAbiHandler;
