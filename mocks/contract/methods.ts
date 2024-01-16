import type {
  SmartContractQueryMethodReadError,
  SmartContractQueryMethodReadSuccess,
  SmartContractReadMethod,
  SmartContractWriteMethod,
} from 'types/api/contract';

export const read: Array<SmartContractReadMethod> = [
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: 'wallet', type: 'address' },
    ],
    method_id: '70a08231',
    name: 'FLASHLOAN_PREMIUM_TOTAL',
    outputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    method_id: '06fdde03',
    name: 'name',
    outputs: [
      { internalType: 'string', name: '', type: 'string', value: 'Wrapped POA' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    method_id: '18160ddd',
    name: 'totalSupply',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256', value: '139905710421584994690047413' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    error: '(-32015) VM execution error. (revert)',
    inputs: [],
    method_id: 'df0ad3de',
    name: 'upgradeabilityAdmin',
    outputs: [
      { name: '', type: 'address', value: '' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    method_id: '165ec2e2',
    name: 'arianeeWhitelist',
    outputs: [
      {
        name: '',
        type: 'address',
        value: '0xd3eee7f8e8021db24825c3457d5479f2b57f40ef',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    method_id: '69598efe',
    name: 'totalPartitions',
    constant: true,
    payable: false,
    outputs: [
      {
        type: 'bytes32[]',
        name: 'bytes32[]',
        value: [
          '0x7265736572766564000000000000000000000000000000000000000000000000',
          '0x6973737565640000000000000000000000000000000000000000000000000000',
        ],
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const readResultSuccess: SmartContractQueryMethodReadSuccess = {
  is_error: false,
  result: {
    names: [ 'amount' ],
    output: [
      { type: 'uint256', value: '42' },
    ],
  },
};

export const readResultError: SmartContractQueryMethodReadError = {
  is_error: true,
  result: {
    message: 'Some shit happened',
    code: -32017,
    raw: '49276d20616c7761797320726576657274696e67207769746820616e206572726f72',
  },
};

export const write: Array<SmartContractWriteMethod> = [
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'guy', type: 'address' },
      { internalType: 'uint256', name: 'wad', type: 'uint256' },
    ],
    name: 'setReserveInterestRateStrategyAddress',
    outputs: [
      { internalType: 'bool', name: '', type: 'bool' },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'src', type: 'address' },
      { internalType: 'address', name: 'dst', type: 'address' },
    ],
    name: 'transferFrom',
    outputs: [
      { internalType: 'bool', name: '', type: 'bool' },
    ],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
  {
    constant: false,
    inputs: [],
    name: 'pause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_tokenId', type: 'uint256' },
      { name: '_data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_tokenId', type: 'uint256' },
      { name: '_hash', type: 'bytes32' },
      { name: '_keepRequestToken', type: 'bool' },
      { name: '_newOwner', type: 'address' },
      { name: '_signature', type: 'bytes' },
    ],
    name: 'requestToken',
    outputs: [
      { name: 'reward', type: 'uint256' },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_tokenId', type: 'uint256' },
      { name: '_imprint', type: 'bytes32' },
      { name: '_uri', type: 'string' },
      { name: '_initialKey', type: 'address' },
      { name: '_tokenRecoveryTimestamp', type: 'uint256' },
      { name: '_initialKeyIsRequestKey', type: 'bool' },
    ],
    name: 'hydrateToken',
    outputs: [
      { name: '', type: 'uint256' },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
