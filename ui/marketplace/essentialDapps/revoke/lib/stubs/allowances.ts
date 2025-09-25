import type { AllowanceType } from '../types';

import { ZERO_ADDRESS } from 'toolkit/utils/consts';

export default Array.from({ length: 3 }, () => ({
  type: 'ERC-20',
  address: ZERO_ADDRESS,
  transactionId: null,
  allowance: 'Unlimited',
  balance: '100000',
  decimals: 18,
  spender: ZERO_ADDRESS,
  symbol: 'ETH',
  name: 'Ethereum',
  totalSupply: BigInt(0),
  timestamp: 0,
  valueAtRiskUsd: 100000,
})) as Array<AllowanceType>;
