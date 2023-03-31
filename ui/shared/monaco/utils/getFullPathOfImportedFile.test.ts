import getFullPathOfImportedFile from './getFullPathOfImportedFile';

it('construct correct absolute path', () => {
  const result = getFullPathOfImportedFile(
    '/foo/bar/baz/index.sol',
    './.././../abc/contract.sol',
  );

  expect(result).toBe('/foo/abc/contract.sol');
});

it('returns undefined if imported file is outside the base file folder', () => {
  const result = getFullPathOfImportedFile(
    '/index.sol',
    '../../abc/contract.sol',
  );

  expect(result).toBeUndefined();
});

it('returns unmodified path if it is already absolute', () => {
  const result = getFullPathOfImportedFile(
    '/index.sol',
    '/abc/contract.sol',
  );

  expect(result).toBe('/abc/contract.sol');
});

it('returns undefined for external path', () => {
  const result = getFullPathOfImportedFile(
    '/index.sol',
    'https://github.com/ethereum/dapp/contract.sol',
  );

  expect(result).toBeUndefined();
});
