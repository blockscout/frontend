import type { AddressTokenBalance } from 'types/api/address';

export const erc20a: AddressTokenBalance = {
  token: {
    address: '0xb2a90505dc6680a7a695f7975d0d32EeF610f456',
    decimals: '18',
    exchange_rate: null,
    holders: '23',
    name: 'hyfi.token',
    symbol: 'HyFi',
    total_supply: '369000000000000000000000000',
    type: 'ERC-20',
  },
  token_id: null,
  value: '1169320000000000000000000',
};

export const erc20b: AddressTokenBalance = {
  token: {
    address: '0xc1116c98ba622a6218433fF90a2E40DEa482d7A7',
    decimals: '6',
    exchange_rate: '0.982',
    holders: '17',
    name: 'USD Coin',
    symbol: 'USDC',
    total_supply: '900000000000000000000000000',
    type: 'ERC-20',
  },
  token_id: null,
  value: '872500000000',
};

export const erc20c: AddressTokenBalance = {
  token: {
    address: '0xc1116c98ba622a6218433fF90a2E40DEa482d7A7',
    decimals: '18',
    exchange_rate: '1328.89',
    holders: '17',
    name: 'Ethereum',
    symbol: 'ETH',
    total_supply: '1000000000000000000000000',
    type: 'ERC-20',
  },
  token_id: null,
  value: '9852000000000000000000',
};

export const erc721a: AddressTokenBalance = {
  token: {
    address: '0xDe7cAc71E072FCBd4453E5FB3558C2684d1F88A0',
    decimals: null,
    exchange_rate: null,
    holders: '7',
    name: 'HyFi Athena',
    symbol: 'HYFI_ATHENA',
    total_supply: '105',
    type: 'ERC-721',
  },
  token_id: null,
  value: '51',
};

export const erc721b: AddressTokenBalance = {
  token: {
    address: '0xA8d5C7beEA8C9bB57f5fBa35fB638BF45550b11F',
    decimals: null,
    exchange_rate: null,
    holders: '2',
    name: 'World Of Women Galaxy',
    symbol: 'WOWG',
    total_supply: null,
    type: 'ERC-721',
  },
  token_id: null,
  value: '1',
};

export const erc721c: AddressTokenBalance = {
  token: {
    address: '0x47646F1d7dc4Dd2Db5a41D092e2Cf966e27A4992',
    decimals: null,
    exchange_rate: null,
    holders: '12',
    name: 'Puma',
    symbol: 'PUMA',
    total_supply: null,
    type: 'ERC-721',
  },
  token_id: null,
  value: '5',
};

export const erc1155a: AddressTokenBalance = {
  token: {
    address: '0x4b333DEd10c7ca855EA2C8D4D90A0a8b73788c8e',
    decimals: null,
    exchange_rate: null,
    holders: '22',
    name: 'HyFi Membership',
    symbol: 'HYFI_MEMBERSHIP',
    total_supply: '482',
    type: 'ERC-1155',
  },
  token_id: '42',
  value: '24',
};

export const erc1155b: AddressTokenBalance = {
  token: {
    address: '0xf4b71b179132ad457f6bcae2a55efa9e4b26eefc',
    decimals: null,
    exchange_rate: null,
    holders: '100',
    name: 'WinkyVerse Collections',
    symbol: 'WVC',
    total_supply: '4943',
    type: 'ERC-1155',
  },
  token_id: '100010000000001',
  value: '11',
};

export const erc1155withoutName: AddressTokenBalance = {
  token: {
    address: '0x4b333DEd10c7ca855EA2C8D4D90A0a8b73788c8e',
    decimals: null,
    exchange_rate: null,
    holders: '22',
    name: null,
    symbol: null,
    total_supply: '482',
    type: 'ERC-1155',
  },
  token_id: '64532245',
  value: '42',
};

export const baseList = [
  erc20a,
  erc20b,
  erc20c,
  erc721a,
  erc721b,
  erc721c,
  erc1155withoutName,
  erc1155a,
  erc1155b,
];
