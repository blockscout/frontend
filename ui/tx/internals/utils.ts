import type { TxInternalsType } from 'types/api/tx';

interface TxInternalsTypeItem {
  title: string;
  id: TxInternalsType;
}

export const TX_INTERNALS_ITEMS: Array<TxInternalsTypeItem> = [
  { title: 'Call', id: 'call' },
  { title: 'Delegate call', id: 'delegate_call' },
  { title: 'Static call', id: 'static_call' },
  { title: 'Create', id: 'create' },
  { title: 'Create2', id: 'create2' },
  { title: 'Self-destruct', id: 'self_destruct' },
  { title: 'Reward', id: 'reward' },
];
