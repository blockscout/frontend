import type { FlashblockItemApi } from 'types/api/flashblocks';
import type { FlashblockItem } from 'types/client/flashblocks';

export default function formatFlashblockItem(item: FlashblockItemApi): FlashblockItem {

  const number = (() => {
    if ('block_number' in item.metadata && typeof item.metadata.block_number === 'number') {
      return item.metadata.block_number;
    }

    if (item.base?.block_number) {
      return Number(item.base.block_number);
    }
  })();

  return {
    block_number: number,
    index: item.index,
    transactions_count: item.diff.transactions.length,
    gas_used: Number(item.diff.gas_used),
  };
}
