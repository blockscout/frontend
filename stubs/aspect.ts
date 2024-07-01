import type { AspectBinding, AspectDetail, AspectTxs } from '../types/api/aspect';

export const BINDING: AspectBinding = {
  bind_aspect_transaction_hash: '0x3680cabce3118a0d25e3820536815e4c499c20af3c65c3d44fbf8a22fffeef8a',
  bind_aspect_transaction_index: 0,
  bind_block_number: 5781108,
  bound_address_hash: '0x19bf4fe746c370e2930cd8c1b3dcfa55270c8ed7',
  contract_code: 0,
  is_smart_contract: false,
  priority: 1,
  version: 1,
};

export const ASPECTTXS: AspectTxs = {
  block_hash: '0xffd67f3741fa30c632beb67933bbaef16b4567638d32d7c1e06577b6852ab0be',
  block_number: 5781129,
  error: null,
  fee: {
    type: 'actual',
    value: '56000000',
  },
  from_address_hash: '0x19bf4fe746c370e2930cd8c1b3dcfa55270c8ed7',
  gas_price: '7',
  gas_used: '8000000',
  hash: '0x40776fc0ffb94852a5fc7cedb65f64a3dfcb576f783566fea7dc4a468244c85f',
  index: 2,
  result: 'success',
  status: 'ok',
  to_address_hash: '0x0000000000000000000000000000000000a27e14',
  type: 'operation',
  value: '0',
};

export const ASPECTDETAIL: AspectDetail = {
  bound_address_count: 21,
  deployed_tx: '0x0a4c5218e7c96fcc7305cb844b34a747312bd4866e571064b656b2729ec88ec5',
  hash: '0x9639aea2f55e44a5b352a62c80976fae574b7d97',
  join_points: [
    'verify_tx',
  ],
  properties: { },
  versions: [
    {
      aspect_transaction_hash: '0x0a4c5218e7c96fcc7305cb844b34a747312bd4866e571064b656b2729ec88ec5',
      aspect_transaction_index: 0,
      block_number: 996291,
      join_points: [
        'verify_tx',
      ],
      properties: { },
      version: 1,
    },
  ],
};
