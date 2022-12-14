import type { TokenTransfer, TokenTransferResponse } from 'types/api/tokenTransfer';

export const erc20: TokenTransfer = {
  from: {
    hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
    implementation_name: null,
    is_contract: true,
    is_verified: true,
    name: 'ArianeeStore',
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
  to: {
    hash: '0x7d20a8D54F955b4483A66aB335635ab66e151c51',
    implementation_name: null,
    is_contract: true,
    is_verified: false,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
  token: {
    address: '0x55d536e4d6c1993d8ef2e2a4ef77f02088419420',
    decimals: '18',
    exchange_rate: null,
    holders: '46554',
    name: 'ARIANEE',
    symbol: 'ARIA',
    type: 'ERC-20',
    total_supply: '0',
  },
  total: {
    decimals: '18',
    value: '31567373703130350',
  },
  tx_hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
  type: 'token_transfer',
};

export const erc721: TokenTransfer = {
  from: {
    hash: '0x621C2a125ec4A6D8A7C7A655A18a2868d35eb43C',
    implementation_name: null,
    is_contract: false,
    is_verified: false,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
  to: {
    hash: '0x47eE48AEBc4ab9Ed908b805b8c8dAAa71B31Db1A',
    implementation_name: null,
    is_contract: false,
    is_verified: false,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
  token: {
    address: '0x363574E6C5C71c343d7348093D84320c76d5Dd29',
    decimals: null,
    exchange_rate: null,
    holders: '63090',
    name: 'Arianee Smart-Asset',
    symbol: 'AriaSA',
    type: 'ERC-721',
    total_supply: '0',
  },
  total: {
    token_id: '875879856',
  },
  tx_hash: '0xf13bc7afe5e02b494dd2f22078381d36a4800ef94a0ccc147431db56c301e6cc',
  type: 'token_transfer',
};

export const erc1155: TokenTransfer = {
  from: {
    hash: '0x0000000000000000000000000000000000000000',
    implementation_name: null,
    is_contract: false,
    is_verified: false,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
  to: {
    hash: '0xBb36c792B9B45Aaf8b848A1392B0d6559202729E',
    implementation_name: null,
    is_contract: false,
    is_verified: false,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
  token: {
    address: '0xF56b7693E4212C584de4a83117f805B8E89224CB',
    decimals: null,
    exchange_rate: null,
    holders: '1',
    name: null,
    symbol: null,
    type: 'ERC-1155',
    total_supply: '0',
  },
  total: {
    token_id: '123',
    value: '42',
    decimals: null,
  },
  tx_hash: '0x05d6589367633c032d757a69c5fb16c0e33e3994b0d9d1483f82aeee1f05d746',
  type: 'token_minting',
};

export const erc1155multiple: TokenTransfer = {
  ...erc1155,
  token: {
    ...erc1155.token,
    name: 'OLYMPIC',
  },
  total: [
    { token_id: '456', value: '42', decimals: null },
    { token_id: '12345678', value: '142', decimals: null },
    { token_id: '1000006457499', value: '11', decimals: null },
  ],
};

export const mixTokens: TokenTransferResponse = {
  items: [
    erc20,
    erc721,
    erc1155,
    erc1155multiple,
  ],
  next_page_params: null,
};
