// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AbiEvent } from 'viem';
import { encodeAbiParameters, toEventSelector } from 'viem';

import type { schemas } from '@blockscout/api-types';

import * as logMocks from 'src/slices/log/mocks/log';

import { describe, expect, it } from 'vitest';

import { decodeLogData } from './decode-log-data';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const NESTED_TUPLE_ABI = {
  anonymous: false,
  inputs: [
    { indexed: true, name: 'maker', type: 'address' },
    {
      indexed: false,
      name: 'order',
      type: 'tuple',
      components: [
        { name: 'salt', type: 'uint256' },
        {
          name: 'fee',
          type: 'tuple',
          components: [
            { name: 'recipient', type: 'address' },
            { name: 'bps', type: 'uint16' },
          ],
        },
      ],
    },
  ],
  name: 'OrderPlaced',
  type: 'event',
} satisfies AbiEvent;

const TRANSFER_ABI = {
  anonymous: false,
  inputs: [
    { indexed: true, name: 'from', type: 'address' },
    { indexed: true, name: 'to', type: 'address' },
    { indexed: true, name: 'tokenId', type: 'uint256' },
  ],
  name: 'Transfer',
  type: 'event',
} satisfies AbiEvent;

const buildLog = (abi: unknown, data: string, topics: schemas['Log']['topics']): Pick<schemas['Log'], 'decoded' | 'topics' | 'data'> => ({
  // The generated response type declares `abi` as an empty object, so an event ABI can only be assigned through a cast.
  decoded: { method_call: null, method_id: null, parameters: [], abi: abi as schemas['DecodedLogInput']['abi'] },
  topics,
  data,
});

describe('decodeLogData', () => {
  it('decodes the non-indexed inputs of an event with tuple arrays, in the declared order', () => {
    const result = decodeLogData(logMocks.withTupleArrayAbi);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.inputs.map(({ abiParameter }) => abiParameter.name)).toEqual([ 'orderHash', 'recipient', 'offer', 'consideration' ]);
    expect(result.inputs.map(({ value }) => value)).toEqual([
      '0xf0ddc1a089d95fc5eb13d4d8e7a9b3315f67bfe5f0a4b4bc341074951ef9859c',
      '0x32ce26D377421954918D8E22389e313663017514',
      [
        { itemType: 0, token: ZERO_ADDRESS, identifier: BigInt(0), amount: BigInt('89100000000000000') },
        { itemType: 0, token: ZERO_ADDRESS, identifier: BigInt(0), amount: BigInt('900000000000000') },
      ],
      [],
    ]);
  });

  it('keeps the tuple components on the returned ABI parameter', () => {
    const result = decodeLogData(logMocks.withTupleArrayAbi);

    expect(result.ok && result.inputs[2].abiParameter).toMatchObject({
      type: 'tuple[]',
      components: [ { name: 'itemType' }, { name: 'token' }, { name: 'identifier' }, { name: 'amount' } ],
    });
  });

  it('decodes a nested tuple with its fields named', () => {
    const data = encodeAbiParameters(
      [ NESTED_TUPLE_ABI.inputs[1] ],
      [ { salt: BigInt(7), fee: { recipient: '0x32ce26D377421954918D8E22389e313663017514', bps: 250 } } ],
    );
    const result = decodeLogData(buildLog(NESTED_TUPLE_ABI, data, [ toEventSelector(NESTED_TUPLE_ABI), null, null, null ]));

    expect(result).toEqual({
      ok: true,
      inputs: [
        {
          abiParameter: NESTED_TUPLE_ABI.inputs[1],
          value: { salt: BigInt(7), fee: { recipient: '0x32ce26D377421954918D8E22389e313663017514', bps: 250 } },
        },
      ],
    });
  });

  it('reports an event that has no non-indexed inputs', () => {
    const result = decodeLogData(buildLog(TRANSFER_ABI, '0x', [ toEventSelector(TRANSFER_ABI), null, null, null ]));

    expect(result).toEqual({ ok: false, reason: 'no_non_indexed_inputs' });
  });

  it.each([
    [ 'the log has no decoded data', { decoded: null, topics: logMocks.withTupleArrayAbi.topics, data: logMocks.withTupleArrayAbi.data } ],
    [ 'the decoded data has no ABI', logMocks.base ],
    [ 'the ABI is null', buildLog(null, '0x', []) ],
    [ 'the ABI is an empty object', buildLog({}, '0x', []) ],
    [ 'the ABI is not an event', buildLog({ ...TRANSFER_ABI, type: 'function' }, '0x', []) ],
    [ 'a tuple input has no components', buildLog({ ...TRANSFER_ABI, inputs: [ { name: 'order', type: 'tuple' } ] }, '0x', []) ],
  ])('reports a missing ABI when %s', (_, log) => {
    expect(decodeLogData(log)).toEqual({ ok: false, reason: 'no_abi' });
  });

  it.each([
    [ 'the data is shorter than the ABI requires', { ...logMocks.withTupleArrayAbi, data: logMocks.withTupleArrayAbi.data.slice(0, 130) } ],
    [ 'the data is empty', { ...logMocks.withTupleArrayAbi, data: '0x' } ],
    [ 'the data is not hex', { ...logMocks.withTupleArrayAbi, data: 'duck' } ],
    [ 'the first topic is the signature of another event', { ...logMocks.withTupleArrayAbi, topics: [ toEventSelector(TRANSFER_ABI), null, null, null ] } ],
    [ 'the log has no topics', { ...logMocks.withTupleArrayAbi, topics: [] } ],
  ])('reports a data mismatch when %s', (_, log) => {
    expect(decodeLogData(log)).toEqual({ ok: false, reason: 'data_mismatch' });
  });

  it('does not match an anonymous event against the first topic', () => {
    const abi = { ...NESTED_TUPLE_ABI, anonymous: true };
    const data = encodeAbiParameters([ NESTED_TUPLE_ABI.inputs[1] ], [ { salt: BigInt(1), fee: { recipient: ZERO_ADDRESS, bps: 0 } } ]);

    expect(decodeLogData(buildLog(abi, data, [])).ok).toBe(true);
  });
});
