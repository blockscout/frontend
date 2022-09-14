export const data = [
  {
    address: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    miner: 'KuCoin Pool',
    after: {
      balance: '0.012192910371186045',
      nonce: '4',
    },
    before: {
      balance: '0.008350264867549483',
      nonce: '5',
    },
    diff: '0.003842645503636562',
    storage: [
      {
        address: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        before: '0x000000000000000000000000730bc43aac5a6cf94a72f69a42adfa114fe119b5',
        after: '0x000000000000000000000000730bc43aac5a6cf94a72f69a42adfa114fe119b5',
      },
      {
        address: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        before: '0x730bc43aac5a6cf94a72f69a42adfa114fe119b5',
        after: '0x000000000000000000000000730bc43aac5a6cf94a72f69a42adfa114fe119b5',
      },
    ],
  },
  {
    address: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    miner: 'KuCoin Pool',
    after: {
      balance: '0.012192910371186045',
      nonce: '4',
    },
    before: {
      balance: '0.008350264867549483',
      nonce: '5',
    },
    diff: '0.003842645503636562',
    storage: [
      {
        address: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        before: '0x000000000000000000000000730bc43aac5a6cf94a72f69a42adfa114fe119b5',
        after: '0x000000000000000000000000730bc43aac5a6cf94a72f69a42adfa114fe119b5',
      },
      {
        address: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        before: '0x730bc43aac5a6cf94a72f69a42adfa114fe119b5',
        after: '0x000000000000000000000000730bc43aac5a6cf94a72f69a42adfa114fe119b5',
      },
    ],
  },
  {
    address: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    miner: 'KuCoin Pool',
    after: {
      balance: '0.012192910371186045',
    },
    before: {
      balance: '0.008350264867549483',
    },
    diff: '-0.003842645503636562',
  },
];

export type TTxState = Array<TTxStateItem>;

export type TTxStateItem = {
  address: string;
  miner: string;
  after: {
    balance: string;
    nonce?: string;
  };
  before: {
    balance: string;
    nonce?: string;
  };
  diff: string;
  storage?: Array<TTxStateItemStorage>;
}

export type TTxStateItemStorage = {
  address: string;
  before: string;
  after: string;
}
