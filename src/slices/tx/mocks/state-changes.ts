import type { paths, schemas } from '@blockscout/api-types';

import * as addressParamMock from 'src/slices/address/mocks/address-param';
import { toTokenModel } from 'src/slices/token/utils/model';

export const mintToken: schemas['StateChange'] = {
  address: {
    ...addressParamMock.withoutName,
    hash: '0x0000000000000000000000000000000000000000',
  },
  balance_after: null,
  balance_before: null,
  change: '-1',
  is_miner: false,
  token_id: '15077554365819457090226168288698582604878106156134383525616269766016907608065',
  token: toTokenModel({
    address_hash: '0x8977EA6C55e878125d1bF3433EBf72138B7a4543',
    circulating_market_cap: null,
    decimals: null,
    exchange_rate: null,
    holders_count: '9191',
    name: 'ParaSpace Derivative Token MOONBIRD',
    symbol: 'nMOONBIRD',
    total_supply: '10645',
    type: 'ERC-721',
    icon_url: null,
    reputation: 'ok',
  }),
  type: 'token' as const,
};

export const receiveMintedToken: schemas['StateChange'] = {
  address: {
    ...addressParamMock.withoutName,
    hash: '0xC8F71D0ae51AfBdB009E2eC1Ea8CC9Ee204A42B5',
  },
  balance_after: '1',
  balance_before: '0',
  change: '1',
  is_miner: false,
  token_id: '15077554365819457090226168288698582604878106156134383525616269766016907608065',
  token: toTokenModel({
    address_hash: '0x8977EA6C55e878125d1bF3433EBf72138B7a4543',
    circulating_market_cap: null,
    decimals: null,
    exchange_rate: null,
    holders_count: '9191',
    name: 'ParaSpace Derivative Token MOONBIRD',
    symbol: 'nMOONBIRD',
    total_supply: '10645',
    type: 'ERC-721',
    icon_url: null,
    reputation: 'ok',
  }),
  type: 'token' as const,
};

export const transfer1155Token: schemas['StateChange'] = {
  address: {
    ...addressParamMock.withoutName,
    hash: '0x51243E83Db20F8FC2761D894067A2A9eb7B158DE',
  },
  balance_after: '1',
  balance_before: '0',
  change: '1',
  is_miner: false,
  token: toTokenModel({
    address_hash: '0x56Cc277717106E528A9FcC2CD342Ff98db758041',
    circulating_market_cap: null,
    decimals: null,
    exchange_rate: null,
    holders_count: '50413',
    icon_url: null,
    name: null,
    symbol: null,
    total_supply: null,
    type: 'ERC-1155',
    reputation: 'ok',
  }),
  token_id: '1',
  type: 'token' as const,
};

export const receiveCoin: schemas['StateChange'] = {
  address: {
    ...addressParamMock.withoutName,
    hash: '0x8dC847Af872947Ac18d5d63fA646EB65d4D99560',
  },
  balance_after: '443787514723917012805',
  balance_before: '443787484997510408745',
  change: '29726406604060',
  is_miner: true,
  token: null,
  type: 'coin' as const,
};

export const sendCoin: schemas['StateChange'] = {
  address: {
    ...addressParamMock.withoutName,
    hash: '0xC8F71D0ae51AfBdB009E2eC1Ea8CC9Ee204A42B5',
  },
  balance_after: '828282622733717191',
  balance_before: '832127467556437753',
  change: '-3844844822720562',
  is_miner: false,
  token: null,
  type: 'coin' as const,
};

export const sendERC20Token: schemas['StateChange'] = {
  address: {
    ...addressParamMock.withoutName,
    hash: '0x7f6479df95Aa3036a3BE02DB6300ea201ABd9981',
  },
  balance_after: '6814903154',
  balance_before: '9814903154',
  change: '-3000000000',
  is_miner: false,
  token: toTokenModel({
    address_hash: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    circulating_market_cap: '82978861367.28714',
    decimals: '6',
    exchange_rate: '0.992839',
    holders_count: null,
    icon_url: 'https://gateway.tkn.xyz/ipfs/bafybeihrrubjya5nnwgqdm6mfqisxfnv76tl3yd452lkmgomn5n64gzbxu/',
    name: 'Tether USD',
    symbol: 'USDT',
    total_supply: '39030615894320966',
    type: 'ERC-20' as const,
    reputation: 'ok',
  }),
  type: 'token' as const,
};

export const baseResponse: paths['/api/v2/transactions/{transaction_hash_param}/state-changes']['get'] = {
  items: [
    mintToken,
    receiveMintedToken,
    sendCoin,
    receiveCoin,
    transfer1155Token,
    sendERC20Token,
  ],
  next_page_params: {
    items_count: 50,
    state_changes: null,
  },
};
