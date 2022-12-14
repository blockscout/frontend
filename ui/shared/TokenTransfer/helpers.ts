import type { TokenType } from 'types/api/tokenInfo';
import type { TokenTransfer } from 'types/api/tokenTransfer';

export const flattenTotal = (result: Array<TokenTransfer>, item: TokenTransfer): Array<TokenTransfer> => {
  if (Array.isArray(item.total)) {
    item.total.forEach((total) => {
      result.push({ ...item, total });
    });
  } else {
    result.push(item);
  }

  return result;
};

export const getTokenTransferTypeText = (type: TokenTransfer['type']) => {
  switch (type) {
    case 'token_minting':
      return 'Token minting';
    case 'token_burning':
      return 'Token burning';
    case 'token_spawning':
      return 'Token creating';
    case 'token_transfer':
      return 'Token transfer';
  }
};

export const TOKEN_TYPE: Array<{ title: string; id: TokenType }> = [
  { title: 'ERC-20', id: 'ERC-20' },
  { title: 'ERC-721', id: 'ERC-721' },
  { title: 'ERC-1155', id: 'ERC-1155' },
];
