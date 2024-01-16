import type { SmartContractMethodInput } from 'types/api/contract';

import { prepareAbi, transformFieldsToArgs, formatFieldValues } from './utils';

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

describe('function formatFieldValues()', () => {
  const formFields = {
    '_tx%0:nonce%0': '1 000 000 000 000 000 000',
    '_tx%0:sender%1': '0xB375d4150A853482f25E3922A4C64c6C4fF6Ae3c',
    '_tx%0:targets%2': [
      '1',
      'true',
    ],
    '_l2OutputIndex%1': '0xaeff',
    '_paused%2': '0',
    '_withdrawalProof%3': [
      '0x0f',
      '0x02',
    ],
  };

  const inputs: Array<SmartContractMethodInput> = [
    {
      components: [
        { internalType: 'uint256', name: 'nonce', type: 'uint256' },
        { internalType: 'address', name: 'sender', type: 'address' },
        { internalType: 'bool[]', name: 'targets', type: 'bool[]' },
      ],
      internalType: 'tuple',
      name: '_tx',
      type: 'tuple',
    },
    { internalType: 'bytes32', name: '_l2OutputIndex', type: 'bytes32' },
    {
      internalType: 'bool',
      name: '_paused',
      type: 'bool',
    },
    {
      internalType: 'bytes32[]',
      name: '_withdrawalProof',
      type: 'bytes32[]',
    },
  ];

  it('converts values to correct format', () => {
    const result = formatFieldValues(formFields, inputs);
    expect(result).toEqual({
      '_tx%0:nonce%0': '1000000000000000000',
      '_tx%0:sender%1': '0xB375d4150A853482f25E3922A4C64c6C4fF6Ae3c',
      '_tx%0:targets%2': [
        true,
        true,
      ],
      '_l2OutputIndex%1': '0xaeff',
      '_paused%2': false,
      '_withdrawalProof%3': [
        '0x0f',
        '0x02',
      ],
    });
  });

  it('converts nested array string representation to correct format', () => {
    const formFields = {
      '_withdrawalProof%0': '[ [ 1 ], [ 2, 3 ], [ 4 ]]',
    };
    const inputs: Array<SmartContractMethodInput> = [
      { internalType: 'uint[][]', name: '_withdrawalProof', type: 'uint[][]' },
    ];
    const result = formatFieldValues(formFields, inputs);

    expect(result).toEqual({
      '_withdrawalProof%0': [ [ 1 ], [ 2, 3 ], [ 4 ] ],
    });
  });
});

describe('function transformFieldsToArgs()', () => {
  it('groups struct and array fields', () => {
    const formFields = {
      '_paused%2': 'primitive_1',
      '_l2OutputIndex%1': 'primitive_0',
      '_tx%0:nonce%0': 'struct_0',
      '_tx%0:sender%1': 'struct_1',
      '_tx%0:target%2': [ 'struct_2_0', 'struct_2_1' ],
      '_withdrawalProof%3': [
        'array_0',
        'array_1',
      ],
    };

    const args = transformFieldsToArgs(formFields);
    expect(args).toEqual([
      [ 'struct_0', 'struct_1', [ 'struct_2_0', 'struct_2_1' ] ],
      'primitive_0',
      'primitive_1',
      [ 'array_0', 'array_1' ],
    ]);
  });
});
