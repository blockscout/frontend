import { padStart } from 'es-toolkit/compat';

import type { BlockEpoch, BlockEpochElectionRewardDetails, BlockEpochElectionRewardDetailsResponse } from 'types/api/block';

import * as addressMock from '../address/address';
import * as tokenMock from '../tokens/tokenInfo';
import * as tokenTransferMock from '../tokens/tokenTransfer';

export const blockEpoch1: BlockEpoch = {
  number: 1486,
  distribution: {
    carbon_offsetting_transfer: tokenTransferMock.erc20,
    community_transfer: tokenTransferMock.erc20,
    reserve_bolster_transfer: null,
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

function getRewardDetailsItem(index: number): BlockEpochElectionRewardDetails {
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

export const electionRewardDetails1: BlockEpochElectionRewardDetailsResponse = {
  items: Array(15).fill('').map((item, index) => getRewardDetailsItem(index)),
  next_page_params: null,
};
