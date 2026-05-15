import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';

interface Props {
  isLoading: boolean;
  data: Transaction;
}

const TxDetailsFeeRefund = ({ isLoading, data }: Props) => {
  const refund = BigNumber(data.fee_refund || 0);

  if (!refund.gt(0)) {
    return null;
  }

  const grossFee = BigNumber(data.fee.value || 0);
  const netFee = BigNumber.max(grossFee.minus(refund), 0).toString();

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Gas fee returned to the sender from Payback quota"
        isLoading={ isLoading }
      >
        Gas fee refund
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ refund.toString() }
        exchangeRate={ data.exchange_rate }
        loading={ isLoading }
      />

      <DetailedInfo.ItemLabel
        hint="Transaction fee after the Payback refund"
        isLoading={ isLoading }
      >
        Net transaction fee
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ netFee }
        exchangeRate={ data.exchange_rate }
        loading={ isLoading }
      />
    </>
  );
};

export default React.memo(TxDetailsFeeRefund);
