import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { currencyUnits } from 'lib/units';
import { Alert } from 'toolkit/chakra/alert';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

const KNOWN_BUG_PAYBACK_V2_CONTRACTS = new Set([
  '0xdea4687fdba2528d1b30222e199c90b63af8c850',
]);
const CORRECTED_PAYBACK_V2_CONTRACTS = new Set([
  '0x89d1cbd9deaab4dff6f800a336fbdd9a5c6829e4',
]);
const STAKE_FOR_SELECTOR = '0x4bf69206';
const PAYBACK_V2_ROLLOUT_MIN_STAKE_WEI = '1000000000000000000000';

interface Props {
  isLoading: boolean;
  data: Transaction;
}

const TxDetailsPaybackNotice = ({ isLoading, data }: Props) => {
  const toHash = data.to?.hash.toLowerCase();
  const methodCall = data.decoded_input?.method_call.toLowerCase();
  const isStakeForCall = Boolean(
    data.raw_input.toLowerCase().startsWith(STAKE_FOR_SELECTOR) ||
    data.method?.toLowerCase() === 'stakefor' ||
    methodCall?.startsWith('stakefor('),
  );
  const isKnownBugStakeFor = Boolean(
    toHash &&
    KNOWN_BUG_PAYBACK_V2_CONTRACTS.has(toHash) &&
    isStakeForCall,
  );
  const isCorrectedStakeFor = Boolean(
    toHash &&
    CORRECTED_PAYBACK_V2_CONTRACTS.has(toHash) &&
    isStakeForCall,
  );

  if (!isKnownBugStakeFor && !isCorrectedStakeFor) {
    return null;
  }

  const isBelowRolloutMinimum = BigNumber(data.value || 0).lt(PAYBACK_V2_ROLLOUT_MIN_STAKE_WEI);
  const knownBugText = 'This stakeFor used the superseded PaybackV2 address. ' +
    'On that contract, third-party withdrawal ownership is receiver-owned; use the corrected PaybackV2 address for staker-owned withdrawals.';
  const correctedText = isBelowRolloutMinimum ?
    `This stakeFor deposit is below the current PaybackV2 minimum of 1,000 ${ currencyUnits.ether }; ` +
      'the receiver needs at least that much active stake before refund quota is available. ' +
      'Withdrawal ownership remains with the funding wallet through unstakeFor(address,uint256).' :
    'This stakeFor used the corrected PaybackV2 contract. The receiver gets Payback refund quota, ' +
      'while the funding wallet owns and withdraws the stake through unstakeFor(address,uint256).';

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="PaybackV2 receiver staking context"
        isLoading={ isLoading }
      >
        Payback note
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow alignItems="flex-start" whiteSpace="normal">
        <Alert
          status={ isKnownBugStakeFor ? 'warning' : 'info' }
          loading={ isLoading }
          showIcon
          w="fit-content"
          maxW="760px"
        >
          { isKnownBugStakeFor ? knownBugText : correctedText }
        </Alert>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsPaybackNotice);
