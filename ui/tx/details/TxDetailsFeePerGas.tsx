import { Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';

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
      <DetailsInfoItem.Label
        hint="Fee per gas"
        isLoading={ isLoading }
      >
        Fee per gas
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isLoading } mr={ 1 }>
          { BigNumber(txFee).dividedBy(10 ** config.chain.currency.decimals).dividedBy(gasUsed).toFixed() }
          { config.UI.views.tx.hiddenFields?.fee_currency ? '' : ` ${ currencyUnits.ether }` }
        </Skeleton>
      </DetailsInfoItem.Value>
    </>
  );
};

export default TxDetailsFeePerGas;
