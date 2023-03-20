import type { TxStateChange } from 'types/api/txStateChanges';

export const mintToken: TxStateChange = {
  address: {
    hash: '0x0000000000000000000000000000000000000000',
    implementation_name: null,
    is_contract: false,
    is_verified: false,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
  balance_after: null,
  balance_before: null,
  change: [
    {
      direction: 'from',
      total: {
        token_id: '15077554365819457090226168288698582604878106156134383525616269766016907608065',
      },
    },
  ],
  is_miner: false,
  token: {
    address: '0x8977EA6C55e878125d1bF3433EBf72138B7a4543',
    decimals: null,
    exchange_rate: null,
    holders: '9191',
    name: 'ParaSpace Derivative Token MOONBIRD',
    symbol: 'nMOONBIRD',
    total_supply: '10645',
    type: 'ERC-721',
  },
  type: 'token',
};

export const receiveMintedToken: TxStateChange = {
  address: {
    hash: '0xC8F71D0ae51AfBdB009E2eC1Ea8CC9Ee204A42B5',
    implementation_name: null,
    is_contract: false,
    is_verified: false,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
  balance_after: '1',
  balance_before: '0',
  change: [
    {
      direction: 'to',
      total: {
        token_id: '15077554365819457090226168288698582604878106156134383525616269766016907608065',
      },
    },
  ],
  is_miner: false,
  token: {
    address: '0x8977EA6C55e878125d1bF3433EBf72138B7a4543',
    decimals: null,
    exchange_rate: null,
    holders: '9191',
    name: 'ParaSpace Derivative Token MOONBIRD',
    symbol: 'nMOONBIRD',
    total_supply: '10645',
    type: 'ERC-721',
  },
  type: 'token',
};

export const receiveCoin: TxStateChange = {
  address: {
    hash: '0x8dC847Af872947Ac18d5d63fA646EB65d4D99560',
    implementation_name: null,
    is_contract: false,
    is_verified: null,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
  balance_after: '443787514723917012805',
  balance_before: '443787484997510408745',
  change: '29726406604060',
  is_miner: true,
  token: null,
  type: 'coin',
};

export const sendCoin: TxStateChange = {
  address: {
    hash: '0xC8F71D0ae51AfBdB009E2eC1Ea8CC9Ee204A42B5',
    implementation_name: null,
    is_contract: false,
    is_verified: null,
    name: null,
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
  balance_after: '828282622733717191',
  balance_before: '832127467556437753',
  change: '-3844844822720562',
  is_miner: false,
  token: null,
  type: 'coin',
};

export const baseResponse = [
  mintToken,
  receiveMintedToken,
  sendCoin,
  receiveCoin,
];
