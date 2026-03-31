import * as v from 'valibot';

const STORAGE_KEY = 'csv_export_downloads';
const ITEMS_LIMIT = 20;

export const itemSchema = v.object({
  request_id: v.string(),
  file_id: v.nullable(v.string()),
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
  is_highlighted: v.optional(v.boolean()),
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
  const newItems = [ ...items, ...currentItems ].slice(0, ITEMS_LIMIT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
}

export function updateItems(items: Array<StorageItem>) {
  if (items.length === 0) {
    return;
  }
  const currentItems = getItems();
  const newItems = currentItems.map((item) => {
    const itemToUpdate = items.find((itemToUpdate) => itemToUpdate.request_id === item.request_id);
    if (itemToUpdate) {
      return {
        ...item,
        ...itemToUpdate,
      };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
}

export function removeItem(id: string) {
  const items = getItems();
  const newItems = items.filter((item) => item.request_id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
}
