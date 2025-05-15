import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { WEI, WEI_IN_GWEI } from 'toolkit/utils/consts';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  gasToken?: TokenInfo<'ERC-20'> | null;
  gasPrice: string | null;
  isLoading?: boolean;
}

const TxDetailsGasPrice = ({ gasPrice, gasToken, isLoading }: Props) => {
  if (config.UI.views.tx.hiddenFields?.gas_price || !gasPrice) {
    return null;
  }

  const content = (() => {
    if (gasToken) {
      return (
        <Skeleton loading={ isLoading } display="flex">
          <span>{ BigNumber(gasPrice).dividedBy(WEI).toFixed() }</span>
          <TokenEntity token={ gasToken } noCopy onlySymbol w="auto" ml={ 1 }/>
        </Skeleton>
      );
    }

    return (
      <>
        <Skeleton loading={ isLoading } mr={ 1 }>
          { BigNumber(gasPrice).dividedBy(WEI).toFixed() } { currencyUnits.ether }
        </Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary">
          <span>({ BigNumber(gasPrice).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })</span>
        </Skeleton>
      </>
    );
  })();

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Price per unit of gas specified by the sender. Higher gas prices can prioritize transaction inclusion during times of high usage"
        isLoading={ isLoading }
      >
        Gas price
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { content }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default TxDetailsGasPrice;
