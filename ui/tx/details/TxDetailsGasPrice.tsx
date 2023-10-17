import { Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import { WEI, WEI_IN_GWEI } from 'lib/consts';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

interface Props {
  gasPrice: string;
  isLoading?: boolean;
}

const TxDetailsGasPrice = ({ gasPrice, isLoading }: Props) => {
  if (config.UI.views.tx.hiddenFields?.gas_price) {
    return null;
  }

  return (
    <DetailsInfoItem
      title="Gas price"
      hint="Price per unit of gas specified by the sender. Higher gas prices can prioritize transaction inclusion during times of high usage"
      isLoading={ isLoading }
    >
      <Skeleton isLoaded={ !isLoading } mr={ 1 }>
        { BigNumber(gasPrice).dividedBy(WEI).toFixed() } { config.chain.currency.symbol }
      </Skeleton>
      <Skeleton isLoaded={ !isLoading } color="text_secondary">
        <span>({ BigNumber(gasPrice).dividedBy(WEI_IN_GWEI).toFixed() } Gwei)</span>
      </Skeleton>
    </DetailsInfoItem>
  );
};

export default TxDetailsGasPrice;
