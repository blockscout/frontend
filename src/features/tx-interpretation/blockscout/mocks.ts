import type { TxInterpretationResponse } from 'src/features/tx-interpretation/common/types/api';

import { withoutName } from 'src/slices/address/mocks/address-param';
import { toTokenModel } from 'src/slices/token/utils/model';

export const txInterpretation: TxInterpretationResponse = {
  data: {
    summaries: [ {
      summary_template: `{action_type} {amount} {token} to {to_address} on {timestamp}`,
      summary_template_variables: {
        action_type: { type: 'string', value: 'Transfer' },
        amount: { type: 'currency', value: '100' },
        token: {
          type: 'token',
          value: toTokenModel({
            name: 'Duck',
            type: 'ERC-20',
            symbol: 'DUCK',
            address_hash: '0x486a3c5f34cDc4EF133f248f1C81168D78da52e8',
            holders_count: '1152',
            decimals: '18',
            icon_url: null,
            total_supply: '210000000000000000000000000',
            exchange_rate: null,
            circulating_market_cap: null,
            reputation: 'ok',
          }),
        },
        to_address: {
          type: 'address',
          value: withoutName,
        },
        timestamp: {
          type: 'timestamp',
          value: '1687005431',
        },
      },
    } ],
  },
};
