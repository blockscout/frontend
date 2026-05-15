import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { currencyUnits } from 'lib/units';
import { Alert } from 'toolkit/chakra/alert';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

const PAYBACK_V2_CONTRACTS = new Set([
  '0xdea4687fdba2528d1b30222e199c90b63af8c850',
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
  const isPaybackStakeFor = Boolean(
    toHash &&
    PAYBACK_V2_CONTRACTS.has(toHash) &&
    (
      data.raw_input.toLowerCase().startsWith(STAKE_FOR_SELECTOR) ||
      data.method?.toLowerCase() === 'stakefor' ||
      methodCall?.startsWith('stakefor(')
    ),
  );

  if (!isPaybackStakeFor) {
    return null;
  }

  const isBelowRolloutMinimum = BigNumber(data.value || 0).lt(PAYBACK_V2_ROLLOUT_MIN_STAKE_WEI);
  const belowMinimumText = `This stakeFor deposit is below the v2.0.18 rollout minimum of 1,000 ${ currencyUnits.ether }. ` +
    'The receiver owns the stake, and refunds start only after the receiver\'s total V2 Quota stake reaches the contract\'s current minStake(). ' +
    'Existing receiver stake can count toward that minimum.';
  const receiverOwnerText = 'The receiver owns this Payback V2 stake. ' +
    'Refunds apply to transactions signed by the receiver once the receiver meets the contract\'s current minStake().';

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
          status={ isBelowRolloutMinimum ? 'warning' : 'info' }
          loading={ isLoading }
          showIcon
          w="fit-content"
          maxW="760px"
        >
          { isBelowRolloutMinimum ? belowMinimumText : receiverOwnerText }
        </Alert>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsPaybackNotice);
