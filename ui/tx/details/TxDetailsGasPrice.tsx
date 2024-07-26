import { Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import React from 'react';

import config from 'configs/app';
import { WEI, WEI_IN_GWEI } from 'lib/consts';
import { currencyUnits } from 'lib/units';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

interface Props {
  gasPrice: string | null;
  isLoading?: boolean;
}

const TxDetailsGasPrice = ({ gasPrice, isLoading }: Props) => {
  const { t } = useTranslation('common');

  if (config.UI.views.tx.hiddenFields?.gas_price || !gasPrice) {
    return null;
  }

  return (
    <DetailsInfoItem
      title={ t('tx_area.Gas_price') }
      hint={ t('tx_area.Price_per_unit_of_gas_specified_by_the_sender_Higher_gas_prices_can_prioritize_transaction_inclusion_during_times_of_high_usage') }
      isLoading={ isLoading }
    >
      <Skeleton isLoaded={ !isLoading } mr={ 1 }>
        { BigNumber(gasPrice).dividedBy(WEI).toFixed() } { currencyUnits.ether }
      </Skeleton>
      <Skeleton isLoaded={ !isLoading } color="text_secondary">
        <span>({ BigNumber(gasPrice).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })</span>
      </Skeleton>
    </DetailsInfoItem>
  );
};

export default TxDetailsGasPrice;
