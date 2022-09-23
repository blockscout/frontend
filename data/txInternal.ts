import type { TxInternalsType } from 'types/api/tx';

export const data = [
  {
    id: 1,
    type: 'call' as TxInternalsType,
    status: 'success' as const,
    from: '0x12E80C27BfFBB76b4A8d26FF2bfd3C9f310FFA01',
    to: '0xF7A558692dFB5F456e291791da7FAE8Dd046574e',
    value: 0.25207646303,
    gasLimit: 369472,
  },
  {
    id: 2,
    type: 'delegate_call' as TxInternalsType,
    status: 'error' as const,
    from: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    to: '0x12E80C27BfFBB76b4A8d26FF2bfd3C9f310FFA01',
    value: 0.5633333,
    gasLimit: 340022,
  },
  {
    id: 3,
    type: 'static_call' as TxInternalsType,
    status: 'success' as const,
    from: '0x97Aa2EfcF35c0f4c9AaDDCa8c2330fa7A9533830',
    to: '0x35317007D203b8a86CA727ad44E473E40450E378',
    value: 0.421152366,
    gasLimit: 509333,
  },
];
