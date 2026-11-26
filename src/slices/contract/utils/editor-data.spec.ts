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

    expect(result?.isTreePossible).toBe(true);
    expect(result?.files).toEqual([
      { key: '/contracts/proxies/SafeProxy.sol', display_path: '/contracts/proxies/SafeProxy.sol', source_code: 'contract SafeProxy {}' },
      { key: '/contracts/common/Enum.sol', display_path: '/contracts/common/Enum.sol', source_code: 'enum' },
      { key: '/@openzeppelin/contracts/utils/Address.sol', display_path: '/@openzeppelin/contracts/utils/Address.sol', source_code: 'address' },
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
    expect(getEditorData(makeContract({ file_path: null, language }))?.files[0].display_path).toBe(expected);
  });

  test('keeps distinct paths whose content happens to be identical', () => {
    const result = getEditorData(makeContract({
      additional_sources: [
        { file_path: 'contracts/interfaces/IERC165.sol', source_code: 'interface' },
        { file_path: 'contracts/external/IERC165.sol', source_code: 'interface' },
      ],
    }));

    expect(result?.files.map((file) => file.display_path)).toEqual([
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

    expect(result?.files.map((file) => file.display_path)).toEqual([ '/contracts/proxies/SafeProxy.sol', '/contracts/Kept.sol' ]);
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

    expect(result?.isTreePossible).toBe(true);
    expect(result?.files).toEqual([
      { key: '/contracts/proxies/SafeProxy.sol', display_path: '/contracts/proxies/SafeProxy.sol', source_code: 'contract SafeProxy {}' },
      { key: '/contracts/proxies/IProxyCreationCallback.sol', display_path: '/contracts/proxies/IProxyCreationCallback.sol', source_code: 'callback' },
    ]);
  });

  test('keeps every source under its raw path with a unique key when one normalized path carries different content', () => {
    const result = getEditorData(makeContract({
      additional_sources: [
        { file_path: 'contracts/A.sol', source_code: 'version one' },
        { file_path: './contracts/A.sol', source_code: 'version two' },
        { file_path: '/contracts/A.sol', source_code: 'version one' },
        { file_path: './contracts/B.sol', source_code: 'same' },
        { file_path: 'contracts/B.sol', source_code: 'same' },
        { file_path: '', source_code: 'orphan' },
        { file_path: 'contracts/Empty.sol', source_code: '' },
      ],
    }));

    expect(result).toEqual({
      isTreePossible: false,
      files: [
        { key: '/0', display_path: 'contracts/proxies/SafeProxy.sol', source_code: 'contract SafeProxy {}' },
        { key: '/1', display_path: 'contracts/A.sol', source_code: 'version one' },
        { key: '/2', display_path: './contracts/A.sol', source_code: 'version two' },
        { key: '/3', display_path: '/contracts/A.sol', source_code: 'version one' },
        { key: '/4', display_path: './contracts/B.sol', source_code: 'same' },
        { key: '/5', display_path: 'contracts/B.sol', source_code: 'same' },
      ],
    });
  });

  test('detects a conflict between the main file and an additional source', () => {
    const result = getEditorData(makeContract({
      additional_sources: [
        { file_path: './contracts/proxies/SafeProxy.sol', source_code: 'contract SafeProxy { uint256 a; }' },
      ],
    }));

    expect(result?.isTreePossible).toBe(false);
    expect(result?.files.map((file) => file.display_path)).toEqual([
      'contracts/proxies/SafeProxy.sol',
      './contracts/proxies/SafeProxy.sol',
    ]);
  });
});
