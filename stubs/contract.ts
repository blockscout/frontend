import type { SmartContract } from 'types/api/contract';
import type { VerifiedContract } from 'types/api/contracts';

import { ADDRESS_PARAMS } from './addressParams';

export const CONTRACT_CODE_UNVERIFIED = {
  creation_bytecode: '0x60806040526e',
  deployed_bytecode: '0x608060405233',
  is_self_destructed: false,
} as SmartContract;

export const CONTRACT_CODE_VERIFIED = {
  abi: [],
  additional_sources: [],
  can_be_visualized_via_sol2uml: true,
  compiler_settings: {
    compilationTarget: {
      'contracts/StubContract.sol': 'StubContract',
    },
    evmVersion: 'london',
    libraries: {},
    metadata: {
      bytecodeHash: 'ipfs',
    },
    optimizer: {
      enabled: false,
      runs: 200,
    },
    remappings: [],
  },
  compiler_version: 'v0.8.7+commit.e28d00a7',
  creation_bytecode: '0x6080604052348',
  deployed_bytecode: '0x60806040',
  evm_version: 'london',
  external_libraries: [],
  file_path: 'contracts/StubContract.sol',
  is_verified: true,
  name: 'StubContract',
  optimization_enabled: false,
  optimization_runs: 200,
  source_code: 'source_code',
  verified_at: '2023-02-21T14:39:16.906760Z',
} as unknown as SmartContract;

export const VERIFIED_CONTRACT_INFO: VerifiedContract = {
  address: { ...ADDRESS_PARAMS, name: 'StubContract' },
  coin_balance: '30319033612988277',
  compiler_version: 'v0.8.17+commit.8df45f5f',
  has_constructor_args: true,
  language: 'solidity',
  market_cap: null,
  optimization_enabled: false,
  tx_count: 565058,
  verified_at: '2023-04-10T13:16:33.884921Z',
};
