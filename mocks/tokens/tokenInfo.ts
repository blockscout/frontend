import type { TokenCounters, TokenInfo } from 'types/api/token';

export const tokenInfo: TokenInfo = {
  address: '0x55d536e4d6c1993d8ef2e2a4ef77f02088419420',
  circulating_market_cap: '117629601.61913824',
  decimals: '18',
  exchange_rate: '2.0101',
  holders: '46554',
  name: 'ARIANEE',
  symbol: 'ARIA',
  type: 'ERC-20' as const,
  total_supply: '1235',
  icon_url: 'http://localhost:3000/token-icon.png',
};

export const tokenCounters: TokenCounters = {
  token_holders_count: '8838883',
  transfers_count: '88282281',
};

export const tokenInfoERC20a: TokenInfo<'ERC-20'> = {
  address: '0xb2a90505dc6680a7a695f7975d0d32EeF610f456',
  circulating_market_cap: '117268489.23970924',
  decimals: '18',
  exchange_rate: null,
  holders: '23',
  name: 'hyfi.token',
  symbol: 'HyFi',
  total_supply: '369000000000000000000000000',
  type: 'ERC-20' as const,
  icon_url: 'http://localhost:3000/token-icon.png',
};

export const tokenInfoERC20b: TokenInfo<'ERC-20'> = {
  address: '0xc1116c98ba622a6218433fF90a2E40DEa482d7A7',
  circulating_market_cap: '115060192.36105014',
  decimals: '6',
  exchange_rate: '0.982',
  holders: '17',
  name: 'USD Coin',
  symbol: 'USDC',
  total_supply: '900000000000000000000000000',
  type: 'ERC-20' as const,
  icon_url: null,
};

export const tokenInfoERC20c: TokenInfo<'ERC-20'> = {
  address: '0xc1116c98ba622a6218433fF90a2E40DEa482d7A8',
  circulating_market_cap: null,
  decimals: '18',
  exchange_rate: '1328.89',
  holders: '17',
  name: 'Ethereum',
  symbol: 'ETH',
  total_supply: '1000000000000000000000000',
  type: 'ERC-20' as const,
  icon_url: null,
};

export const tokenInfoERC20d: TokenInfo<'ERC-20'> = {
  address: '0xCc7bb2D219A0FC08033E130629C2B854b7bA9196',
  circulating_market_cap: null,
  decimals: '18',
  exchange_rate: null,
  holders: '102625',
  name: 'Zeta',
  symbol: 'ZETA',
  total_supply: '2100000000000000000000000000',
  type: 'ERC-20' as const,
  icon_url: null,
};

export const tokenInfoERC20LongSymbol: TokenInfo<'ERC-20'> = {
  address: '0xCc7bb2D219A0FC08033E130629C2B854b7bA9197',
  circulating_market_cap: '112855875.75888918',
  decimals: '18',
  exchange_rate: '1328.89',
  holders: '102625',
  name: 'Zeta',
  symbol: 'ipfs://QmUpFUfVKDCWeZQk5pvDFUxnpQP9N6eLSHhNUy49T1JVtY',
  total_supply: '2100000000000000000000000000',
  type: 'ERC-20' as const,
  icon_url: null,
};

export const tokenInfoERC721a: TokenInfo<'ERC-721'> = {
  address: '0xDe7cAc71E072FCBd4453E5FB3558C2684d1F88A0',
  circulating_market_cap: null,
  decimals: null,
  exchange_rate: null,
  holders: '7',
  name: 'HyFi Athena',
  symbol: 'HYFI_ATHENA',
  total_supply: '105',
  type: 'ERC-721' as const,
  icon_url: null,
};

export const tokenInfoERC721b: TokenInfo<'ERC-721'> = {
  address: '0xA8d5C7beEA8C9bB57f5fBa35fB638BF45550b11F',
  circulating_market_cap: null,
  decimals: null,
  exchange_rate: null,
  holders: '2',
  name: 'World Of Women Galaxy',
  symbol: 'WOWG',
  total_supply: null,
  type: 'ERC-721' as const,
  icon_url: null,
};

export const tokenInfoERC721c: TokenInfo<'ERC-721'> = {
  address: '0x47646F1d7dc4Dd2Db5a41D092e2Cf966e27A4992',
  circulating_market_cap: null,
  decimals: null,
  exchange_rate: null,
  holders: '12',
  name: 'Puma',
  symbol: 'PUMA',
  total_supply: null,
  type: 'ERC-721' as const,
  icon_url: null,
};

export const tokenInfoERC721LongSymbol: TokenInfo<'ERC-721'> = {
  address: '0x47646F1d7dc4Dd2Db5a41D092e2Cf966e27A4993',
  circulating_market_cap: null,
  decimals: null,
  exchange_rate: null,
  holders: '12',
  name: 'Puma',
  symbol: 'ipfs://QmUpFUfVKDCWeZQk5pvDFUxnpQP9N6eLSHhNUy49T1JVtY',
  total_supply: null,
  type: 'ERC-721' as const,
  icon_url: null,
};

export const tokenInfoERC1155a: TokenInfo<'ERC-1155'> = {
  address: '0x4b333DEd10c7ca855EA2C8D4D90A0a8b73788c8e',
  circulating_market_cap: null,
  decimals: null,
  exchange_rate: null,
  holders: '22',
  name: 'HyFi Membership',
  symbol: 'HYFI_MEMBERSHIP',
  total_supply: '482',
  type: 'ERC-1155' as const,
  icon_url: null,
};

export const tokenInfoERC1155b: TokenInfo<'ERC-1155'> = {
  address: '0xf4b71b179132ad457f6bcae2a55efa9e4b26eefc',
  circulating_market_cap: null,
  decimals: null,
  exchange_rate: null,
  holders: '100',
  name: 'WinkyVerse Collections',
  symbol: 'WVC',
  total_supply: '4943',
  type: 'ERC-1155' as const,
  icon_url: null,
};

export const tokenInfoERC1155WithoutName: TokenInfo<'ERC-1155'> = {
  address: '0x4b333DEd10c7ca855EA2C8D4D90A0a8b73788c8a',
  circulating_market_cap: null,
  decimals: null,
  exchange_rate: null,
  holders: '22',
  name: null,
  symbol: null,
  total_supply: '482',
  type: 'ERC-1155' as const,
  icon_url: null,
};

export const tokenInfoERC404: TokenInfo<'ERC-404'> = {
  address: '0xB5C457dDB4cE3312a6C5a2b056a1652bd542a208',
  circulating_market_cap: '0.0',
  decimals: '18',
  exchange_rate: '1484.13',
  holders: '81',
  icon_url: null,
  name: 'OMNI404',
  symbol: 'O404',
  total_supply: '6482275000000000000',
  type: 'ERC-404' as const,
};

export const bridgedTokenA: TokenInfo<'ERC-20'> = {
  ...tokenInfoERC20a,
  is_bridged: true,
  origin_chain_id: '1',
  bridge_type: 'omni',
  foreign_address: '0x4b333DEd10c7ca855EA2C8D4D90A0a8b73788c8b',
};

export const bridgedTokenB: TokenInfo<'ERC-20'> = {
  ...tokenInfoERC20b,
  is_bridged: true,
  origin_chain_id: '56',
  bridge_type: 'omni',
  foreign_address: '0xf4b71b179132ad457f6bcae2a55efa9e4b26eefd',
};

export const bridgedTokenC: TokenInfo<'ERC-20'> = {
  ...tokenInfoERC20d,
  is_bridged: true,
  origin_chain_id: '99',
  bridge_type: 'amb',
  foreign_address: '0x47646F1d7dc4Dd2Db5a41D092e2Cf966e27A4994',
};
