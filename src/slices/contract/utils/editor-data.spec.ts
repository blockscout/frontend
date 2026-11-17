// SPDX-License-Identifier: LicenseRef-Blockscout

import type { SmartContract } from 'src/slices/contract/types/api';

import { describe, expect, test } from 'vitest';

import { getEditorData } from './editor-data';

function makeContract(overrides: Partial<SmartContract>): SmartContract {
  return {
    language: 'solidity',
    file_path: 'contracts/proxies/SafeProxy.sol',
    source_code: 'contract SafeProxy {}',
    additional_sources: [],
    ...overrides,
  } as SmartContract;
}

describe('getEditorData', () => {
  test('returns undefined without source code', () => {
    expect(getEditorData(undefined)).toBeUndefined();
    expect(getEditorData(makeContract({ source_code: '' }))).toBeUndefined();
  });

  test('puts the normalized main file first, followed by additional sources', () => {
    const result = getEditorData(makeContract({
      additional_sources: [
        { file_path: './contracts/common/Enum.sol', source_code: 'enum' },
        { file_path: '@openzeppelin/contracts/utils/Address.sol', source_code: 'address' },
      ],
    }));

    expect(result).toEqual([
      { file_path: '/contracts/proxies/SafeProxy.sol', source_code: 'contract SafeProxy {}' },
      { file_path: '/contracts/common/Enum.sol', source_code: 'enum' },
      { file_path: '/@openzeppelin/contracts/utils/Address.sol', source_code: 'address' },
    ]);
  });

  test.each([
    [ 'solidity', '/index.sol' ],
    [ 'vyper', '/index.vy' ],
    [ 'yul', '/index.yul' ],
    [ 'scilla', '/index.scilla' ],
    [ 'stylus_rust', '/index.rs' ],
    [ 'geas', '/index.eas' ],
    [ null, '/index.sol' ],
  ] as const)('names the main file by language when the API gives no path (%s)', (language, expected) => {
    expect(getEditorData(makeContract({ file_path: null, language }))?.[0].file_path).toBe(expected);
  });

  test('keeps distinct paths whose content happens to be identical', () => {
    const result = getEditorData(makeContract({
      additional_sources: [
        { file_path: 'contracts/interfaces/IERC165.sol', source_code: 'interface' },
        { file_path: 'contracts/external/IERC165.sol', source_code: 'interface' },
      ],
    }));

    expect(result?.map((file) => file.file_path)).toEqual([
      '/contracts/proxies/SafeProxy.sol',
      '/contracts/interfaces/IERC165.sol',
      '/contracts/external/IERC165.sol',
    ]);
  });

  test('drops additional sources without a path or content', () => {
    const result = getEditorData(makeContract({
      additional_sources: [
        { file_path: '', source_code: 'orphan' },
        { file_path: 'contracts/Empty.sol', source_code: '' },
        { file_path: 'contracts/Kept.sol', source_code: 'kept' },
      ],
    }));

    expect(result?.map((file) => file.file_path)).toEqual([ '/contracts/proxies/SafeProxy.sol', '/contracts/Kept.sol' ]);
  });

  test('keeps a single copy of a file repeated under prefix-only path variants with identical content', () => {
    const result = getEditorData(makeContract({
      additional_sources: [
        { file_path: 'contracts/proxies/IProxyCreationCallback.sol', source_code: 'callback' },
        { file_path: '/contracts/proxies/SafeProxy.sol', source_code: 'contract SafeProxy {}' },
        { file_path: '/contracts/proxies/IProxyCreationCallback.sol', source_code: 'callback' },
        { file_path: './contracts/proxies/IProxyCreationCallback.sol', source_code: 'callback' },
      ],
    }));

    expect(result).toEqual([
      { file_path: '/contracts/proxies/SafeProxy.sol', source_code: 'contract SafeProxy {}' },
      { file_path: '/contracts/proxies/IProxyCreationCallback.sol', source_code: 'callback' },
    ]);
  });

  test('keeps both entries when the same path carries different content', () => {
    const result = getEditorData(makeContract({
      additional_sources: [
        { file_path: 'contracts/A.sol', source_code: 'version one' },
        { file_path: '/contracts/A.sol', source_code: 'version two' },
      ],
    }));

    expect(result?.slice(1)).toEqual([
      { file_path: '/contracts/A.sol', source_code: 'version one' },
      { file_path: '/contracts/A.sol', source_code: 'version two' },
    ]);
  });
});
