// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AbiEvent, AbiParameter } from 'viem';
import { decodeAbiParameters, isHex, toEventSelector } from 'viem';

import type { schemas } from '@blockscout/api-types';

export interface DecodedLogDataInput {
  readonly abiParameter: AbiParameter;
  readonly value: unknown;
}

export type LogDataDecodeFailure = 'no_abi' | 'no_non_indexed_inputs' | 'data_mismatch';

export type LogDataDecodeResult =
  { readonly ok: true; readonly inputs: ReadonlyArray<DecodedLogDataInput> } |
  { readonly ok: false; readonly reason: LogDataDecodeFailure };

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isAbiParameter = (value: unknown): value is AbiParameter => {
  if (!isRecord(value) || typeof value.type !== 'string') {
    return false;
  }

  if (value.name !== undefined && typeof value.name !== 'string') {
    return false;
  }

  if (!value.type.startsWith('tuple')) {
    return true;
  }

  return Array.isArray(value.components) && value.components.every(isAbiParameter);
};

const isAbiEvent = (value: unknown): value is AbiEvent =>
  isRecord(value) &&
  value.type === 'event' &&
  typeof value.name === 'string' &&
  Array.isArray(value.inputs) &&
  value.inputs.every(isAbiParameter);

const isEventOfLog = (abiEvent: AbiEvent, topics: schemas['Log']['topics']): boolean => {
  if (abiEvent.anonymous) {
    return true;
  }

  try {
    return topics[0] === toEventSelector(abiEvent);
  } catch {
    return false;
  }
};

export const decodeLogData = ({ decoded, topics, data }: Pick<schemas['Log'], 'decoded' | 'topics' | 'data'>): LogDataDecodeResult => {
  const abiEvent: unknown = decoded?.abi;

  if (!isAbiEvent(abiEvent)) {
    return { ok: false, reason: 'no_abi' };
  }

  const nonIndexedInputs = abiEvent.inputs.filter((input) => !input.indexed);

  if (nonIndexedInputs.length === 0) {
    return { ok: false, reason: 'no_non_indexed_inputs' };
  }

  if (!isHex(data) || !isEventOfLog(abiEvent, topics)) {
    return { ok: false, reason: 'data_mismatch' };
  }

  try {
    const values = decodeAbiParameters(nonIndexedInputs, data);
    return {
      ok: true,
      inputs: nonIndexedInputs.map((abiParameter, index) => ({ abiParameter, value: values[index] })),
    };
  } catch {
    return { ok: false, reason: 'data_mismatch' };
  }
};
