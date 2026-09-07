import * as chainsMock from 'src/features/multichain/mocks/chains';

export const homeChain = {
  ...chainsMock.chainA,
  // should match chain id from playwright/.env.pw file
  id: '1',
};

export const chainB = chainsMock.chainB;
export const chainC = chainsMock.chainC;
export const chainD = chainsMock.chainD;
