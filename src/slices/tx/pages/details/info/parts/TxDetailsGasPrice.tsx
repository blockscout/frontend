// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenInfo } from 'src/slices/token/types/api';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import GasPriceValue from 'src/shared/values/entity/GasPriceValue';
import TokenValue from 'src/shared/values/entity/TokenValue';

interface Props {
  gasToken?: TokenInfo | null;
  gasPrice: string | null;
  isLoading?: boolean;
}

const TxDetailsGasPrice = ({ gasPrice, gasToken, isLoading }: Props) => {
  if (config.slices.tx.hiddenFields?.gas_price || !gasPrice) {
    return null;
  }

  const content = (() => {
    if (gasToken) {
      return (
        <TokenValue
          amount={ gasPrice }
          token={ gasToken }
          loading={ isLoading }
          accuracy={ 0 }
        />
      );
    }

    return (
      <GasPriceValue
        amount={ gasPrice }
        loading={ isLoading }
      />
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
      <DetailedInfo.ItemValue multiRow>
        { content }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default TxDetailsGasPrice;
