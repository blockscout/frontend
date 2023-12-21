import { extractVariables, checkTemplate } from './utils';

const template = '{action_type} {source_amount} Ether into {destination_amount} {destination_token}';

it('extracts variables names', () => {
  const result = extractVariables(template);
  expect(result).toEqual([ 'action_type', 'source_amount', 'destination_amount', 'destination_token' ]);
});

it('check template true', () => {
  const variables = {
    action_type: { type: 'string' as const, value: 'Wrap' },
    source_amount: { type: 'currency' as const, value: '0.7' },
    destination_amount: { type: 'currency' as const, value: '0.7' },
    destination_token: {
      type: 'token' as const,
      value: {
        name: 'Duck',
        type: 'ERC-20' as const,
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
  };
  const result = checkTemplate({ summary_template: template, summary_template_variables: variables });
  expect(result).toBe(true);
});

it('check template false', () => {
  const variables = {
    action_type: { type: 'string' as const, value: 'Wrap' },
    source_amount: { type: 'currency' as const, value: '0.7' },
    destination_amount: { type: 'currency' as const, value: '0.7' },
  };
  const result = checkTemplate({ summary_template: template, summary_template_variables: variables });
  expect(result).toBe(false);
});
