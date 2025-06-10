import { padStart } from 'es-toolkit/compat';

import type { CeloEpochDetails, CeloEpochElectionRewardDetails, CeloEpochElectionRewardDetailsResponse, CeloEpochListResponse } from 'types/api/epochs';

import * as addressMock from '../address/address';
import * as tokenMock from '../tokens/tokenInfo';
import * as tokenTransferMock from '../tokens/tokenTransfer';

export const epoch1: CeloEpochDetails = {
  timestamp: '2025-06-10T01:27:52.000000Z',
  number: 1739,
  start_block_number: 48477132,
  start_processing_block_hash: '0x9dece1eb0e26a95fdf57d2f3a65a6f2e00ca0192e8e3dd157eca0cd323670fa1',
  start_processing_block_number: 48563546,
  end_processing_block_hash: '0x9dece1eb0e26a95fdf57d2f3a65a6f2e00ca0192e8e3dd157eca0cd323670fa2',
  end_processing_block_number: 48563552,
  end_block_number: 48563551,
  distribution: {
    carbon_offsetting_transfer: tokenTransferMock.erc20,
    community_transfer: tokenTransferMock.erc20,
    transfers_total: {
      token: tokenMock.tokenInfoERC20a,
      total: {
        value: '1000000000000000000',
        decimals: '18',
      },
    },
  },
  aggregated_election_rewards: {
    delegated_payment: {
      count: 0,
      total: '71210001063118670575',
      token: tokenMock.tokenInfoERC20d,
    },
    group: {
      count: 10,
      total: '157705500305820107521',
      token: tokenMock.tokenInfoERC20b,
    },
    validator: {
      count: 10,
      total: '1348139501689262297152',
      token: tokenMock.tokenInfoERC20c,
    },
    voter: {
      count: 38,
      total: '2244419545166303388',
      token: tokenMock.tokenInfoERC20a,
    },
  },
};

export const list: CeloEpochListResponse = {
  items: [
    {
      timestamp: '2025-06-10T01:27:52.000000Z',
      number: 1739,
      end_block_number: 48563551,
      start_block_number: 48477132,
      distribution: {
        carbon_offsetting_transfer: {
          decimals: '18',
          value: '1629660620900772288455',
        },
        community_transfer: {
          decimals: '18',
          value: '65186424836030891538',
        },
        transfers_total: {
          decimals: '18',
          value: '1694847045736803179993',
        },
      },
    },
    {
      timestamp: '2025-06-09T01:27:32.000000Z',
      number: 1738,
      end_block_number: 18477131,
      start_block_number: 18390714,
      distribution: {
        carbon_offsetting_transfer: {
          decimals: '18',
          value: '1723199576750509130678',
        },
        community_transfer: {
          decimals: '18',
          value: '68927983070020365227',
        },
        transfers_total: {
          decimals: '18',
          value: '1792127559820529495905',
        },
      },
    },
  ],
  next_page_params: null,
};

function getRewardDetailsItem(index: number): CeloEpochElectionRewardDetails {
  return {
    amount: `${ 100 - index }210001063118670575`,
    account: {
      ...addressMock.withoutName,
      hash: `0x30D060F129817c4DE5fBc1366d53e19f43c8c6${ padStart(String(index), 2, '0') }`,
    },
    associated_account: {
      ...addressMock.withoutName,
      hash: `0x456f41406B32c45D59E539e4BBA3D7898c3584${ padStart(String(index), 2, '0') }`,
    },
  };
}

export const electionRewardDetails1: CeloEpochElectionRewardDetailsResponse = {
  items: Array(15).fill('').map((item, index) => getRewardDetailsItem(index)),
  next_page_params: null,
};
