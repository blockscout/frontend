import { Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import React from 'react';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

interface Props {
  txFee: string | null;
  gasUsed: string | null;
  isLoading?: boolean;
}

const TxDetailsFeePerGas = ({ txFee, gasUsed, isLoading }: Props) => {
  const { t } = useTranslation('common');

  if (!config.UI.views.tx.additionalFields?.fee_per_gas || !gasUsed || txFee === null) {
    return null;
  }

  return (
    <DetailsInfoItem
      title={ t('tx_area.Fee_per_gas') }
      hint={ t('tx_area.Fee_per_gas') }
      isLoading={ isLoading }
    >
      <Skeleton isLoaded={ !isLoading } mr={ 1 }>
        { BigNumber(txFee).dividedBy(10 ** config.chain.currency.decimals).dividedBy(gasUsed).toFixed() }
        { config.UI.views.tx.hiddenFields?.fee_currency ? '' : ` ${ currencyUnits.ether }` }
      </Skeleton>
    </DetailsInfoItem>
  );
};

export default TxDetailsFeePerGas;
