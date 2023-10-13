import type { TokenType } from 'types/api/token';

export const TOKEN_TYPES: Array<{ title: string; id: TokenType }> = [
  { title: 'ERC-20', id: 'ERC-20' },
  { title: 'ERC-721', id: 'ERC-721' },
  { title: 'ERC-1155', id: 'ERC-1155' },
];

export const TOKEN_TYPE_IDS = TOKEN_TYPES.map(i => i.id);
