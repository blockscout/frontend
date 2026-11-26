import type { AbiEvent } from 'viem';

import type { schemas } from '@blockscout/api-types';

import * as addressParamMocks from 'src/slices/address/mocks/address-param';
import * as inputDataMocks from 'src/slices/log/mocks/decoded-input';

const TOPICS = [
  '0x3a4ec416703c36a61a4b1f690847f1963a6829eac0b52debd40a23b66c142a56',
  '0x0000000000000000000000000000000000000000000000000000000005001bcf',
  '0xe835d1028984e9e6e7d016b77164eacbcc6cc061e9333c0b37982b504f7ea791',
  null,
];
const DATA = '0x0000000000000000000000000000000000000000000000000070265bf0112cee';

export const base: schemas['Log'] = {
  address: addressParamMocks.withName,
  topics: TOPICS,
  data: DATA,
  transaction_hash: '0x404bd417203769f968aacb1d66211510db86b81303b0c68283b4eb4572e6845c',
  block_timestamp: null,
  block_number: 9005750,
  decoded: inputDataMocks.withIndexedFields,
  index: 42,
  smart_contract: null,
  block_hash: '0x404bd417203769f968aacb1d66211510db86b81303b0c68283b4eb4572e6845c',
};

const ORDER_FULFILLED_ABI = {
  anonymous: false,
  inputs: [
    { indexed: false, internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
    { indexed: true, internalType: 'address', name: 'offerer', type: 'address' },
    { indexed: true, internalType: 'address', name: 'zone', type: 'address' },
    { indexed: false, internalType: 'address', name: 'recipient', type: 'address' },
    {
      components: [
        { internalType: 'enum ItemType', name: 'itemType', type: 'uint8' },
        { internalType: 'address', name: 'token', type: 'address' },
        { internalType: 'uint256', name: 'identifier', type: 'uint256' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      indexed: false,
      internalType: 'struct SpentItem[]',
      name: 'offer',
      type: 'tuple[]',
    },
    {
      components: [
        { internalType: 'enum ItemType', name: 'itemType', type: 'uint8' },
        { internalType: 'address', name: 'token', type: 'address' },
        { internalType: 'uint256', name: 'identifier', type: 'uint256' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'address payable', name: 'recipient', type: 'address' },
      ],
      indexed: false,
      internalType: 'struct ReceivedItem[]',
      name: 'consideration',
      type: 'tuple[]',
    },
  ],
  name: 'OrderFulfilled',
  type: 'event',
} satisfies AbiEvent;

export const withTupleArrayAbi: schemas['Log'] = {
  ...base,
  topics: [
    '0x9d9af8e38d66c62e2c12f0225249fd9d721c54b83f48d9352c97c6cacdcb6f31',
    '0x00000000000000000000000032ce26d377421954918d8e22389e313663017514',
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    null,
  ],
  data: '0x' +
    'f0ddc1a089d95fc5eb13d4d8e7a9b3315f67bfe5f0a4b4bc341074951ef9859c' +
    '00000000000000000000000032ce26d377421954918d8e22389e313663017514' +
    '0000000000000000000000000000000000000000000000000000000000000080' +
    '00000000000000000000000000000000000000000000000000000000000001a0' +
    '0000000000000000000000000000000000000000000000000000000000000002' +
    '0000000000000000000000000000000000000000000000000000000000000000' +
    '0000000000000000000000000000000000000000000000000000000000000000' +
    '0000000000000000000000000000000000000000000000000000000000000000' +
    '000000000000000000000000000000000000000000000000013c8bfa597cc000' +
    '0000000000000000000000000000000000000000000000000000000000000000' +
    '0000000000000000000000000000000000000000000000000000000000000000' +
    '0000000000000000000000000000000000000000000000000000000000000000' +
    '0000000000000000000000000000000000000000000000000003328b944c4000' +
    '0000000000000000000000000000000000000000000000000000000000000000',
  decoded: {
    method_call: 'OrderFulfilled(bytes32 orderHash, address indexed offerer, address indexed zone, address recipient, ' +
      '(uint8,address,uint256,uint256)[] offer, (uint8,address,uint256,uint256,address)[] consideration)',
    method_id: '9d9af8e3',
    parameters: [
      { indexed: false, name: 'orderHash', type: 'bytes32', value: '0xf0ddc1a089d95fc5eb13d4d8e7a9b3315f67bfe5f0a4b4bc341074951ef9859c' },
      { indexed: true, name: 'offerer', type: 'address', value: '0x32ce26D377421954918D8E22389e313663017514' },
      { indexed: true, name: 'zone', type: 'address', value: '0x0000000000000000000000000000000000000000' },
      { indexed: false, name: 'recipient', type: 'address', value: '0x32ce26D377421954918D8E22389e313663017514' },
      {
        indexed: false,
        name: 'offer',
        type: '(uint8,address,uint256,uint256)[]',
        value: [
          [ '0', '0x0000000000000000000000000000000000000000', '0', '89100000000000000' ],
          [ '0', '0x0000000000000000000000000000000000000000', '0', '900000000000000' ],
        ],
      },
      { indexed: false, name: 'consideration', type: '(uint8,address,uint256,uint256,address)[]', value: [] },
    ],
    // The generated response type declares `abi` as an empty object, so an event ABI can only be assigned through a cast.
    abi: ORDER_FULFILLED_ABI as unknown as schemas['DecodedLogInput']['abi'],
  },
};
