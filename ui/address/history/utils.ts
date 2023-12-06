import type { AccountHistoryResponse } from 'types/translateApi';
import type { ArrayElement } from 'types/utils';

export function generateHistoryStub(
  stub: ArrayElement<AccountHistoryResponse['items']>,
  num = 50,
  rest: Omit<AccountHistoryResponse, 'items'>,
) {
  return {
    items: Array(num).fill(stub),
    ...rest,
  };
}
