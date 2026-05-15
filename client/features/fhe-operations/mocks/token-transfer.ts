import type { TokenTransfer } from 'client/slices/token-transfer/types/api';

import { erc7984Token } from './token';

export const erc7984: TokenTransfer = {
  from: {
    hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
    implementations: null,
    is_contract: true,
    is_verified: true,
    name: 'ArianeeStore',
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
    ens_domain_name: null,
  },
  to: {
    hash: '0x7d20a8D54F955b4483A66aB335635ab66e151c51',
    implementations: null,
    is_contract: true,
    is_verified: false,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
    ens_domain_name: null,
  },
  token: erc7984Token,
  total: null,
  transaction_hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
  type: 'token_transfer',
  token_type: 'ERC-20',
  timestamp: '2022-10-10T14:34:30.000000Z',
  block_number: '12345',
  block_hash: '1',
  log_index: '1',
  method: 'transfer',
};
