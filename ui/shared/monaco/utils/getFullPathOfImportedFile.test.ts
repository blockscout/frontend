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

it('correctly manages remappings', () => {
  const result = getFullPathOfImportedFile(
    '/index.sol',
    'node_modules/@openzeppelin/contracts/access/AccessControl.sol',
    [ '@ensdomains/=node_modules/@ensdomains/', '@openzeppelin/=node_modules/@openzeppelin/' ],
  );

  expect(result).toBe('/node_modules/@openzeppelin/contracts/access/AccessControl.sol');
});
