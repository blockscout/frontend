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
