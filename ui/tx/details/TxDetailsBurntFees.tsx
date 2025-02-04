import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import { ZERO } from 'lib/consts';
import { useFetchTransactionByHash } from 'lib/getTransactionInfo';
import { currencyUnits } from 'lib/units';
import CurrencyValue from 'ui/shared/CurrencyValue';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import IconSvg from 'ui/shared/IconSvg';

const rollupFeature = config.features.rollup;

interface Props {
  data: Transaction;
  isLoading?: boolean;
}

const TxDetailsBurntFees = ({ data, isLoading }: Props) => {
  const rwaBurnInfoQueryResult = useFetchTransactionByHash(data.hash);

  if (
    config.UI.views.tx.hiddenFields?.burnt_fees ||
    (rollupFeature.isEnabled && rollupFeature.type === 'optimistic')
  ) {
    return null;
  }

  const value = BigNumber(data.transaction_burnt_fee || 0).plus(
    BigNumber(data.blob_gas_used || 0).multipliedBy(
      BigNumber(data.blob_gas_price || 0),
    ),
  );

  if (value.isEqualTo(ZERO)) {
    return null;
  }

  return (
    <>
      <DetailsInfoItem.Label
        hint={ `
            Amount of ${ currencyUnits.ether } burned for this transaction.
          ` }
        isLoading={ isLoading }
      >
        Burnt fees
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <IconSvg
          name="flame"
          boxSize={ 5 }
          color="gray.500"
          isLoading={ isLoading }
        />
        <CurrencyValue
          value={ rwaBurnInfoQueryResult.data?.burn.toString() }
          currency={ currencyUnits.ether }
          exchangeRate={ data.exchange_rate }
          flexWrap="wrap"
          ml={ 2 }
          isLoading={ isLoading }
        />
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(TxDetailsBurntFees);
