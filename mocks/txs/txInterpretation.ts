import type { TxInterpretationResponse } from 'types/api/txInterpretation';

export const txInterpretation: TxInterpretationResponse = {
  data: {
    summaries: [ {
      summary_template: `{action_type} {amount} {token} to {to_address} on {timestamp}`,
      summary_template_variables: {
        action_type: { type: 'string', value: 'Transfer' },
        amount: { type: 'currency', value: '100' },
        token: {
          type: 'token',
          value: {
            name: 'Duck',
            type: 'ERC-20',
            symbol: 'DUCK',
            address: '0x486a3c5f34cDc4EF133f248f1C81168D78da52e8',
            holders: '1152',
            decimals: '18',
            icon_url: null,
            total_supply: '210000000000000000000000000',
            exchange_rate: null,
            circulating_market_cap: null,
          },
        },
        to_address: {
          type: 'address',
          value: {
            hash: '0x48c04ed5691981C42154C6167398f95e8f38a7fF',
            implementation_name: null,
            is_contract: false,
            is_verified: false,
            name: null,
            private_tags: [],
            public_tags: [],
            watchlist_names: [],
            ens_domain_name: null,
          },
        },
        timestamp: {
          type: 'timestamp',
          value: '1687005431',
        },
      },
    } ],
  },
};
