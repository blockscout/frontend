import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

interface Props {
  txFee: string | null;
  gasUsed: string | null;
  isLoading?: boolean;
}

const TxDetailsFeePerGas = ({ txFee, gasUsed, isLoading }: Props) => {
  if (!config.UI.views.tx.additionalFields?.fee_per_gas || !gasUsed || txFee === null) {
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
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading } mr={ 1 }>
          { BigNumber(txFee).dividedBy(10 ** config.chain.currency.decimals).dividedBy(gasUsed).toFixed() }
          { config.UI.views.tx.hiddenFields?.fee_currency ? '' : ` ${ currencyUnits.ether }` }
        </Skeleton>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default TxDetailsFeePerGas;
