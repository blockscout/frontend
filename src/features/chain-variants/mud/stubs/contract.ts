import type { SmartContractMudSystemsResponse } from '../types/api';

import { ADDRESS_HASH } from 'src/slices/address/stubs/address-params';

export const MUD_SYSTEMS: SmartContractMudSystemsResponse = {
  items: [
    {
      name: 'sy.AccessManagement',
      address_hash: ADDRESS_HASH,
    },
  ],
};
