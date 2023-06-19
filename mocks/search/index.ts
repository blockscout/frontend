import type { SearchResultToken, SearchResultBlock, SearchResultAddressOrContract, SearchResultTx, SearchResultLabel, SearchResult } from 'types/api/search';

export const token1: SearchResultToken = {
  address: '0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
  address_url: '/address/0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
  name: 'Toms NFT',
  symbol: 'TNT',
  token_url: '/token/0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
  type: 'token' as const,
  icon_url: 'http://localhost:3000/token-icon.png',
};

export const token2: SearchResultToken = {
  address: '0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
  address_url: '/address/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
  name: 'TomToken',
  symbol: 'pdE1B',
  token_url: '/token/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
  type: 'token' as const,
  icon_url: null,
};

export const block1: SearchResultBlock = {
  block_hash: '0x1af31d7535dded06bab9a88eb40ee2f8d0529a60ab3b8a7be2ba69b008cacbd1',
  block_number: 8198536,
  type: 'block' as const,
  url: '/block/0x1af31d7535dded06bab9a88eb40ee2f8d0529a60ab3b8a7be2ba69b008cacbd1',
};

export const address1: SearchResultAddressOrContract = {
  address: '0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
  name: null,
  type: 'address' as const,
  url: '/address/0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
};

export const contract1: SearchResultAddressOrContract = {
  address: '0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
  name: 'Unknown contract in this network',
  type: 'contract' as const,
  url: '/address/0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
};

export const label1: SearchResultLabel = {
  address: '0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
  name: 'utko',
  type: 'label' as const,
  url: '/address/0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
};

export const tx1: SearchResultTx = {
  tx_hash: '0x349d4025d03c6faec117ee10ac0bce7c7a805dd2cbff7a9f101304d9a8a525dd',
  type: 'transaction' as const,
  url: '/tx/0x349d4025d03c6faec117ee10ac0bce7c7a805dd2cbff7a9f101304d9a8a525dd',
};

export const baseResponse: SearchResult = {
  items: [
    token1,
    token2,
    block1,
    address1,
    contract1,
    tx1,
  ],
  next_page_params: null,
};
