import type { File } from './types';

// Conflict mode: the two `Tick.sol` files share a normalized path and differ in content,
// so every file keeps its raw path and gets an index-based key, as the contract slice's editor-data step builds them.
const SOURCES_WITH_CONFLICT: Array<Pick<File, 'display_path' | 'source_code'>> = [
  { display_path: 'contracts/Pool.sol', source_code: 'contract Pool {}' },
  { display_path: 'contracts/interfaces/IPool.sol', source_code: 'interface IPool {}' },
  { display_path: './contracts/libraries/Tick.sol', source_code: 'pragma solidity ^0.8.20; library Tick {}' },
  { display_path: 'contracts/libraries/Tick.sol', source_code: 'pragma solidity >=0.5.0; library Tick {}' },
  { display_path: '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20.sol', source_code: 'interface IERC20 {}' },
];

export const filesWithConflict: Array<File> = SOURCES_WITH_CONFLICT.map((source, index) => ({ key: `/${ index }`, ...source }));

export const mainFileWithConflict = filesWithConflict[0];

export const twinFileWithConflict = filesWithConflict[3];

const SOURCES_WITHOUT_CONFLICT: Array<Pick<File, 'display_path' | 'source_code'>> = [
  { display_path: '/contracts/Pool.sol', source_code: 'contract Pool {}' },
  { display_path: '/contracts/interfaces/IPool.sol', source_code: 'interface IPool {}' },
  { display_path: '/contracts/libraries/Tick.sol', source_code: 'library Tick {}' },
  { display_path: '/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20.sol', source_code: 'interface IERC20 {}' },
];

export const filesWithoutConflict: Array<File> = SOURCES_WITHOUT_CONFLICT.map((source) => ({ key: source.display_path, ...source }));

export const mainFileWithoutConflict = filesWithoutConflict[0];

export const selectedFileWithoutConflict = filesWithoutConflict[2];
