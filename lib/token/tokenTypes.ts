import type { NFTTokenType, TokenType } from 'types/api/token';

export const NFT_TOKEN_TYPES: Array<{ title: string; id: NFTTokenType }> = [
  { title: 'DRC-721', id: 'DRC-721' },
  { title: 'DRC-1155', id: 'DRC-1155' },
  { title: 'DRC-404', id: 'DRC-404' },
];

export const TOKEN_TYPES: Array<{ title: string; id: TokenType }> = [
  { title: 'DRC-20', id: 'DRC-20' },
  ...NFT_TOKEN_TYPES,
];

export const NFT_TOKEN_TYPE_IDS = NFT_TOKEN_TYPES.map(i => i.id);
export const TOKEN_TYPE_IDS = TOKEN_TYPES.map(i => i.id);
