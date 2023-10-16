import { Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

interface Props {
  txFee: string;
  gasUsed: string | null;
  isLoading?: boolean;
}

const TxDetailsFeePerGas = ({ txFee, gasUsed, isLoading }: Props) => {
  if (!config.UI.views.tx.additionalFields?.fee_per_gas || !gasUsed) {
    return null;
  }

  return (
    <DetailsInfoItem
      title="Fee per gas"
      hint="Fee per gas"
      isLoading={ isLoading }
    >
      <Skeleton isLoaded={ !isLoading } mr={ 1 }>
        { BigNumber(txFee).dividedBy(10 ** config.chain.currency.decimals).dividedBy(gasUsed).toFixed() }
        { config.UI.views.tx.hiddenFields?.fee_currency ? '' : ` ${ config.chain.currency.symbol }` }
      </Skeleton>
    </DetailsInfoItem>
  );
};

export default TxDetailsFeePerGas;
