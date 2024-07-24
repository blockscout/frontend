import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import { ZERO } from 'lib/consts';
import { currencyUnits } from 'lib/units';
import CurrencyValue from 'ui/shared/CurrencyValue';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import IconSvg from 'ui/shared/IconSvg';

const rollupFeature = config.features.rollup;

interface Props {
  data: Transaction;
  isLoading?: boolean;
}

const TxDetailsBurntFees = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');

  if (config.UI.views.tx.hiddenFields?.burnt_fees || (rollupFeature.isEnabled && rollupFeature.type === 'optimistic')) {
    return null;
  }

  const value = BigNumber(data.tx_burnt_fee || 0).plus(BigNumber(data.blob_gas_used || 0).multipliedBy(BigNumber(data.blob_gas_price || 0)));

  if (value.isEqualTo(ZERO)) {
    return null;
  }

  return (
    <DetailsInfoItem
      title={ t('Burnt_fees') }
      hint={ `
            ${ t('tx_area.Burnt_fees_hint1') } ${ currencyUnits.ether } ${ t('tx_area.Burnt_fees_hint2') }
            ${ data.blob_gas_price && data.blob_gas_used ? ' ' + t('Burnt_fees_hint3') : '' }
          ` }
      isLoading={ isLoading }
    >
      <IconSvg name="flame" boxSize={ 5 } color="gray.500" isLoading={ isLoading }/>
      <CurrencyValue
        value={ value.toString() }
        currency={ currencyUnits.ether }
        exchangeRate={ data.exchange_rate }
        flexWrap="wrap"
        ml={ 2 }
        isLoading={ isLoading }
      />
    </DetailsInfoItem>
  );
};

export default React.memo(TxDetailsBurntFees);
