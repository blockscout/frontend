import type { schemas } from '@blockscout/api-types';

import { base } from 'src/slices/tx/mocks/details';

export const l2tx: schemas['TransactionResponse'] = {
  ...base,
  l1_gas_price: '82702201886',
  l1_fee_scalar: '1.0',
  l1_gas_used: '17060',
  l1_fee: '1584574188135760',
  operator_fee: '2769347953',
  op_withdrawals: [
    {
      l1_transaction_hash: '0x7d93a59a228e97d084a635181c3053e324237d07566ec12287eae6da2bcf9456',
      nonce: 1,
      status: 'Relayed',
      portal_contract_address_hash: null,
      msg_sender_address_hash: null,
      msg_target_address_hash: null,
      msg_data: null,
      msg_gas_limit: null,
      msg_nonce_raw: '0',
      msg_value: null,
    },
  ],
};
