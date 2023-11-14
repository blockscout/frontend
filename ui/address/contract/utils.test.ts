import { prepareAbi } from './utils';

describe('function prepareAbi()', () => {
  const commonAbi = [
    {
      inputs: [
        { internalType: 'address', name: '_pool', type: 'address' },
        { internalType: 'address', name: '_token', type: 'address' },
        { internalType: 'uint256', name: '_denominator', type: 'uint256' },
      ],
      stateMutability: 'nonpayable' as const,
      type: 'constructor' as const,
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: 'uint256[]', name: 'indices', type: 'uint256[]' },
      ],
      name: 'CompleteDirectDepositBatch',
      type: 'event' as const,
    },
    {
      inputs: [
        { internalType: 'address', name: '_fallbackUser', type: 'address' },
        { internalType: 'string', name: '_zkAddress', type: 'string' },
      ],
      name: 'directNativeDeposit',
      outputs: [
        { internalType: 'uint256', name: '', type: 'uint256' },
      ],
      stateMutability: 'payable' as const,
      type: 'function' as const,
    },
  ];

  const method = {
    inputs: [
      { internalType: 'address' as const, name: '_fallbackUser', type: 'address' as const },
      { internalType: 'string' as const, name: '_zkAddress', type: 'string' as const },
    ],
    name: 'directNativeDeposit',
    outputs: [
      { internalType: 'uint256' as const, name: '', type: 'uint256' as const },
    ],
    stateMutability: 'payable' as const,
    type: 'function' as const,
    constant: false,
    payable: true,
  };

  it('if there is only one method with provided name, does nothing', () => {
    const abi = prepareAbi(commonAbi, method);
    expect(abi).toHaveLength(commonAbi.length);
  });

  it('if there are two or more methods with the same name and inputs length, filters out those which input types are not matched', () => {
    const abi = prepareAbi([
      ...commonAbi,
      {
        inputs: [
          { internalType: 'address', name: '_fallbackUser', type: 'address' },
          { internalType: 'bytes', name: '_rawZkAddress', type: 'bytes' },
        ],
        name: 'directNativeDeposit',
        outputs: [
          { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        stateMutability: 'payable',
        type: 'function',
      },
    ], method);

    expect(abi).toHaveLength(commonAbi.length);

    const item = abi.find((item) => 'name' in item ? item.name === method.name : false);
    expect(item).toEqual(commonAbi[2]);
  });

  it('if there are two or more methods with the same name and different inputs length, filters out those which inputs are not matched', () => {
    const abi = prepareAbi([
      ...commonAbi,
      {
        inputs: [
          { internalType: 'address', name: '_fallbackUser', type: 'address' },
        ],
        name: 'directNativeDeposit',
        outputs: [
          { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        stateMutability: 'payable',
        type: 'function',
      },
    ], method);

    expect(abi).toHaveLength(commonAbi.length);

    const item = abi.find((item) => 'name' in item ? item.name === method.name : false);
    expect(item).toEqual(commonAbi[2]);
  });
});
