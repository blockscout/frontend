import type { SmartContract, SolidityscanReport } from 'types/api/contract';
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

export const SOLIDITYSCAN_REPORT: SolidityscanReport = {
  scan_report: {
    scan_status: 'scan_done',
    scan_summary: {
      issue_severity_distribution: {
        critical: 0,
        gas: 1,
        high: 0,
        informational: 0,
        low: 2,
        medium: 0,
      },
      lines_analyzed_count: 18,
      scan_time_taken: 1,
      score: '3.61',
      score_v2: '72.22',
      threat_score: '94.74',
    },
    scanner_reference_url: 'https://solidityscan.com/quickscan/0xc1EF7811FF2ebFB74F80ed7423f2AdAA37454be2/blockscout/eth-goerli?ref=blockscout',
  },
};
