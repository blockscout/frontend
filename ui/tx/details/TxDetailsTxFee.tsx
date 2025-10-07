import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import CurrencyValue from 'ui/shared/CurrencyValue';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import * as DetailedInfoItemBreakdown from 'ui/shared/DetailedInfo/DetailedInfoItemBreakdown';
import TxFee from 'ui/shared/tx/TxFee';

interface Props {
  isLoading: boolean;
  data: Transaction;
}

const TxDetailsTxFee = ({ isLoading, data }: Props) => {

  if (config.UI.views.tx.hiddenFields?.tx_fee) {
    return null;
  }

  const content = (() => {
    if (!config.UI.views.tx.groupedFees) {
      return (
        <TxFee
          tx={ data }
          isLoading={ isLoading }
          withUsd
          rowGap={ 0 }
        />
      );
    }

    const baseFeeBn = BigNumber(data.base_fee_per_gas || 0).multipliedBy(data.gas_used || 0);
    const priorityFeeBn = BigNumber(data.priority_fee || 0);

    return (
      <>
        <CurrencyValue
          value={ data.fee.value }
          currency={ currencyUnits.ether }
          exchangeRate={ 'exchange_rate' in data ? data.exchange_rate : null }
          isLoading={ isLoading }
          showGweiTooltip
          flexWrap="wrap"
          mr={ 3 }
          rowGap={ 0 }
        />
        <DetailedInfoItemBreakdown.Container loading={ isLoading }>
          <DetailedInfoItemBreakdown.Row
            label="Base fee"
            hint="The minimum network fee charged per transaction"
          >
            <CurrencyValue
              value={ baseFeeBn.toString() }
              currency={ currencyUnits.ether }
              exchangeRate={ 'exchange_rate' in data ? data.exchange_rate : null }
              isLoading={ isLoading }
              showGweiTooltip
              flexWrap="wrap"
              rowGap={ 0 }
            />
          </DetailedInfoItemBreakdown.Row>
          <DetailedInfoItemBreakdown.Row
            label="Priority fee"
            hint="An extra fee set by the sender to speed up transaction execution"
          >
            <CurrencyValue
              value={ priorityFeeBn.toString() }
              currency={ currencyUnits.ether }
              exchangeRate={ 'exchange_rate' in data ? data.exchange_rate : null }
              isLoading={ isLoading }
              showGweiTooltip
              flexWrap="wrap"
              rowGap={ 0 }
            />
          </DetailedInfoItemBreakdown.Row>
        </DetailedInfoItemBreakdown.Container>

      </>
    );
  })();

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ data.blob_gas_used ? 'Transaction fee without blob fee' : 'Total transaction fee' }
        isLoading={ isLoading }
      >
        Transaction fee
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        { content }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsTxFee);
