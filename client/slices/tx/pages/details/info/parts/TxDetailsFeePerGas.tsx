// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import config from 'client/config';
import React from 'react';

import * as DetailedInfo from 'client/shared/detailed-info/DetailedInfo';
import DetailedInfoNativeCoinValue from 'client/shared/detailed-info/DetailedInfoNativeCoinValue';

interface Props {
  txFee: string | null;
  gasUsed: string | null;
  isLoading?: boolean;
}

const TxDetailsFeePerGas = ({ txFee, gasUsed, isLoading }: Props) => {
  if (!config.slices.tx.additionalFields?.fee_per_gas || !gasUsed || txFee === null) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Fee per gas"
        isLoading={ isLoading }
      >
        Fee per gas
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ BigNumber(txFee).dividedBy(gasUsed).toFixed() }
        noSymbol={ config.slices.tx.hiddenFields?.fee_currency }
        loading={ isLoading }
      />
    </>
  );
};

export default TxDetailsFeePerGas;
