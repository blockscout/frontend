import { Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import { WEI, WEI_IN_GWEI } from 'lib/consts';
import { currencyUnits } from 'lib/units';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';

interface Props {
  gasPrice: string | null;
  isLoading?: boolean;
}

const TxDetailsGasPrice = ({ gasPrice, isLoading }: Props) => {
  if (config.UI.views.tx.hiddenFields?.gas_price || !gasPrice) {
    return null;
  }

  return (
    <>
      <DetailsInfoItem.Label
        hint="Price per unit of gas specified by the sender. Higher gas prices can prioritize transaction inclusion during times of high usage"
        isLoading={ isLoading }
      >
        Gas price
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isLoading } mr={ 1 }>
          { BigNumber(gasPrice).dividedBy(WEI).toFixed() } { currencyUnits.ether }
        </Skeleton>
        <Skeleton isLoaded={ !isLoading } color="text_secondary">
          <span>({ BigNumber(gasPrice).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })</span>
        </Skeleton>
      </DetailsInfoItem.Value>
    </>
  );
};

export default TxDetailsGasPrice;
