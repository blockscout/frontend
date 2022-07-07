export const watchlist = [
  {
    address: '0x4831c121879d3de0e2b181d9d55e9b0724f5d926',
    tokenBalance: 100.1,
    tokenBalanceUSD: 101.2,
    tokensAmount: 2,
    tokensUSD: 202.2,
    totalUSD: 123123,
    tag: 'some_tag',
    notification: true,
  },
  {
    address: '0x8c461F78760988c4135e363a87dd736f8b671ff0',
    tokensAmount: 2,
    tokensUSD: 2202.2,
    totalUSD: 3000.5,
    tag: 'some_other_tag',
    notification: false,
  },
  {
    address: '0x930F381E649c84579Ef58117E923714964C55D16',
    tokenBalance: 200.2,
    tokenBalanceUSD: 202.4,
    totalUSD: 3000.5,
    tag: '12345678901234567890123456789012345',
    notification: false,
  },
];

export type TWatchlist = Array<TWatchlistItem>

export type TWatchlistItem = {
  address: string;
  tokenBalance?: number;
  tokenBalanceUSD?: number;
  tokensAmount?: number;
  tokensUSD?: number;
  totalUSD?: number;
  tag: string;
  notification?: boolean;
}
