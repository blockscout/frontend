import { describe, it, expect } from 'vitest';

import getFullPathOfImportedFile from './getFullPathOfImportedFile';

it('construct correct absolute path', () => {
  const result = getFullPathOfImportedFile(
    '/foo/bar/baz/index.sol',
    './.././../abc/contract.sol',
  );

  expect(result).toBe('/foo/abc/contract.sol');
});

it('construct correct absolute path if file is in the current directory', () => {
  const result = getFullPathOfImportedFile(
    '/abc/index.sol',
    './contract.sol',
  );

  expect(result).toBe('/abc/contract.sol');
});

it('returns undefined if imported file is outside the base file folder', () => {
  const result = getFullPathOfImportedFile(
    '/index.sol',
    '../../abc/contract.sol',
  );

  expect(result).toBeUndefined();
});

describe('returns unmodified path if it is already absolute', () => {
  it('with prefix', () => {
    const result = getFullPathOfImportedFile(
      '/index.sol',
      '/abc/contract.sol',
    );

    expect(result).toBe('/abc/contract.sol');
  });

  it('without prefix', () => {
    const result = getFullPathOfImportedFile(
      '/index.sol',
      'abc/contract.sol',
    );

    expect(result).toBe('/abc/contract.sol');
  });
});

describe('correctly manages remappings', () => {
  it('without context', () => {
    const result = getFullPathOfImportedFile(
      '/index.sol',
      '@openzeppelin/contracts/access/AccessControl.sol',
      [
        '@ensdomains/=node_modules/@ensdomains/',
        '@openzeppelin/=node_modules/@openzeppelin/',
      ],
    );

    expect(result).toBe('/node_modules/@openzeppelin/contracts/access/AccessControl.sol');
  });

  it('with empty context', () => {
    const result = getFullPathOfImportedFile(
      './index.sol',
      '@base58-solidity/Base58.sol',
      [
        '@openzeppelin/=node_modules/@openzeppelin/',
        ':@base58-solidity/=lib/base58-solidity/contracts/',
      ],
    );

    expect(result).toBe('/lib/base58-solidity/contracts/Base58.sol');
  });

  it('with non-empty context for file inside context directory', () => {
    const result = getFullPathOfImportedFile(
      '/module_1/index.sol',
      '@base58-solidity/Base58.sol',
      [
        '@openzeppelin/=node_modules/@openzeppelin/',
        'module_1:@base58-solidity/=lib/base58-solidity/contracts/',
      ],
    );

    expect(result).toBe('/lib/base58-solidity/contracts/Base58.sol');
  });

  it('with non-empty context for file outside context directory', () => {
    const result = getFullPathOfImportedFile(
      '/module_2/index.sol',
      '@base58-solidity/Base58.sol',
      [
        '@openzeppelin/=node_modules/@openzeppelin/',
        'module_1:@base58-solidity/=lib/base58-solidity/contracts/',
      ],
    );

    expect(result).toBe('/@base58-solidity/Base58.sol');
  });

  it('with an empty remappings list', () => {
    expect(getFullPathOfImportedFile('/index.sol', 'abc/contract.sol', [])).toBe('/abc/contract.sol');
  });

  it('when no remapping matches', () => {
    expect(getFullPathOfImportedFile('/index.sol', 'abc/contract.sol', [ '@openzeppelin/=node_modules/@openzeppelin/' ])).toBe('/abc/contract.sol');
  });

  it('when the matching remapping has no target', () => {
    expect(getFullPathOfImportedFile('/index.sol', 'abc/contract.sol', [ 'abc/' ])).toBe('/abc/contract.sol');
  });

  it('when the remapping target is already absolute', () => {
    expect(getFullPathOfImportedFile('/index.sol', 'abc/contract.sol', [ 'abc/=/lib/abc/' ])).toBe('/lib/abc/contract.sol');
  });

  it('when several remappings match, taking the first', () => {
    const result = getFullPathOfImportedFile(
      '/module_1/index.sol',
      'abc/contract.sol',
      [ '/module_1/:abc/=first/', 'abc/=second/' ],
    );

    expect(result).toBe('/first/contract.sol');
  });
});

it('returns undefined if the path climbs above the root before descending', () => {
  const result = getFullPathOfImportedFile(
    '/foo/index.sol',
    './../../abc/contract.sol',
  );

  expect(result).toBeUndefined();
});

it('resolves a parent directory reference in the middle of the path', () => {
  const result = getFullPathOfImportedFile(
    'foo/bar/index.sol',
    './abc/../contract.sol',
  );

  expect(result).toBe('/foo/bar/contract.sol');
});
