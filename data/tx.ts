/* eslint-disable max-len */
export const tx = {
  hash: '0x1ea365d2144796f793883534aa51bf20d23292b19478994eede23dfc599e7c34',
  status: 'ok' as Transaction['status'],
  block_num: 15006918,
  confirmation_num: 283,
  confirmation_duration: 30,
  timestamp: 1662623567695,
  address_from: {
    hash: '0x97Aa2EfcF35c0f4c9AaDDCa8c2330fa7A9533830',
    type: 'Address',
    alias: '',
  },
  address_to: {
    hash: '0x35317007D203b8a86CA727ad44E473E40450E378',
    type: 'Contract',
    alias: '',
  },
  amount: {
    value: 0.03,
    value_usd: 35.5,
  },
  fee: {
    value: 0.002395904453623692,
    value_usd: 2.84,
  },
  gas_price: 0.000000017716513811,
  gas_limit: 208420,
  gas_used: 159319,
  gas_fees: {
    base: 13.538410068,
    max: 20.27657523,
    max_priority: 1.5,
  },
  burnt_fees: {
    value: 0.002156925953623692,
    value_usd: 2.55,
  },
  type: {
    value: '2',
    eip: 'EIP-1559',
  },
  nonce: 4,
  position: 342,
  input_hex: '0x42842e0e0000000000000000000000007767dac225a233ea1055d79fb227b1696d538b75000000000000000000000000fc3017c31fe752fc48e904050ea5d6edfc38a1b00000000000000000000000000000000000000000000000000000000000000e3b',
  transferred_tokens: [
    { from: '0x12E80C27BfFBB76b4A8d26FF2bfd3C9f310FFA01', to: '0xF7A558692dFB5F456e291791da7FAE8Dd046574e', token: { symbol: 'VIK', hash: '0xADFE00d92e5A16e773891F59780e6e54f40B532e', name: 'Viktor Coin' }, amount: 192.7, usd: 194.05 },
    { from: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', to: '0x12E80C27BfFBB76b4A8d26FF2bfd3C9f310FFA01', token: { symbol: 'PAO', hash: '0xC98a06220239818B086CD96756d4E3bC41EC848E', name: 'POA Candy' }, amount: 76.1851851851846, usd: 194.05 },
  ],
  txType: 'transaction' as TxType,
};

export type TxType = 'contract-call' | 'transaction' | 'token-transfer' | 'internal-tx' | 'multicall';

import type { Transaction } from 'types/api/transaction';
