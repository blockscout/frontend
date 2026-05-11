import type { Transaction } from 'client/slices/tx/types/api';

import { base } from 'client/slices/tx/mocks/tx';

export const withActionsUniswap: Transaction = {
  ...base,
  actions: [
    {
      data: {
        address0: '0x6f16598F00eDabEA92B4Cef4b6aa0d45c898A9AE',
        address1: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        amount0: '7143.488560357232097378',
        amount1: '10',
        symbol0: 'Ring ding ding daa baa Baa aramba baa bom baa barooumba Wh-wha-what&#39;s going on-on? Ding, ding This is the Crazy Frog Ding, ding Bem',
        symbol1: 'Ether',
      },
      protocol: 'uniswap_v3',
      type: 'mint',
    },
    {
      data: {
        address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
        ids: [
          '53699',
          '53700123456',
          '42',
        ],
        name: 'Uniswap V3: Positions NFT',
        symbol: 'UNI-V3-POS',
        to: '0x6d872Fb5F5B2B1f71fA9AadE159bc3976c1946B7',
      },
      protocol: 'uniswap_v3',
      type: 'mint_nft',
    },
    {
      data: {
        address0: '0x6f16598F00eDabEA92B4Cef4b6aa0d45c898A9AE',
        address1: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        amount0: '42876.488560357232',
        amount1: '345.908098203434',
        symbol0: 'SHAVUHA',
        symbol1: 'BOB',
      },
      protocol: 'uniswap_v3',
      type: 'swap',
    },
    {
      data: {
        address0: '0x6f16598F00eDabEA92B4Cef4b6aa0d45c898A9AE',
        address1: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        amount0: '42',
        amount1: '0.523523223232',
        symbol0: 'VIC',
        symbol1: 'USDT',
      },
      protocol: 'uniswap_v3',
      type: 'burn',
    },
    {
      data: {
        address0: '0x6f16598F00eDabEA92B4Cef4b6aa0d45c898A9AE',
        address1: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        amount0: '42',
        amount1: '0.523523223232',
        symbol0: 'BOB',
        symbol1: 'UNI',
      },
      protocol: 'uniswap_v3',
      type: 'collect',
    },
  ],
};
