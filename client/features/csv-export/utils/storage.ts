import * as v from 'valibot';

const STORAGE_KEY = 'csv_export_downloads';

export const itemSchema = v.object({
  id: v.string(),
  status: v.union([ v.literal('pending'), v.literal('completed'), v.literal('failed'), v.literal('expired') ]),
  expires_at: v.nullable(v.string()),
  type: v.union([
    v.literal('address_txs'),
    v.literal('address_internal_txs'),
    v.literal('address_token_transfers'),
    v.literal('address_logs'),
    v.literal('token_holders'),
    v.literal('address_epoch_rewards'),
    v.literal('advanced_filters'),
  ]),
  params: v.record(v.string(), v.string()),
});

export type StorageItem = v.InferOutput<typeof itemSchema>;

export function getItems() {
  try {
    const items = localStorage.getItem(STORAGE_KEY);
    if (!items) {
      return [];
    }
    return v.parse(v.array(itemSchema), JSON.parse(items));
  } catch (error) {
    return [];
  }
}

export function addItems(items: Array<StorageItem>) {
  const currentItems = getItems();
  const newItems = [ ...items, ...currentItems ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
}

export function removeItem(id: string) {
  const items = getItems();
  const newItems = items.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
}
