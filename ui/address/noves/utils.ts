import type { NovesAccountHistoryResponse } from 'types/novesApi';
import type { ArrayElement } from 'types/utils';

export function generateHistoryStub(
  stub: ArrayElement<NovesAccountHistoryResponse['items']>,
  num = 50,
  rest: Omit<NovesAccountHistoryResponse, 'items'>,
) {
  return {
    items: Array(num).fill(stub),
    ...rest,
  };
}
