export const watchlist = [
  {
    address: '0x4831c121879d3de0e2b181d9d55e9b0724f5d926',
    tokens: {
      xDAI: {
        symbol: 'xDAI',
        amount: 100,
        decimals: 18,
        usd: 100,
      },
      ABC: {
        symbol: 'ABC',
        amount: 100,
        decimals: 18,
        usd: 100,
      },
    },
    totalUSD: 123123,
    tag: 'some_tag',
    notification: true,
  },
  {
    address: '0x8c461F78760988c4135e363a87dd736f8b671ff0',
    tokens: {
      xDAI: {
        symbol: 'xDAI',
        amount: 200,
        usd: 200,
      },
      ABC: {
        symbol: 'ABC',
        amount: 200,
        usd: 200,
      },
    },
    totalUSD: 123123,
    tag: 'some_other_tag',
  },
];

export type TWatchlist = Array<TWatchlistItem>

export type TWatchlistItem = {
  address: string;
  tokens: Record<string, TTokenItem>;
  totalUSD: number;
  tag: string;
  notification?: boolean;
}

export type TTokenItem = {
  symbol: string;
  amount: number;
  usd: number;
}
