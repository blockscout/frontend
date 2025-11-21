import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import * as DetailedInfoItemBreakdown from 'ui/shared/DetailedInfo/DetailedInfoItemBreakdown';
import TxFee from 'ui/shared/tx/TxFee';
import AssetValue from 'ui/shared/value/AssetValue';

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
          accuracy={ 0 }
          withUsd
          rowGap={ 0 }
        />
      );
    }

    return (
      <>
        <AssetValue
          amount={ data.fee.value }
          asset={ currencyUnits.ether }
          decimals={ String(config.chain.currency.decimals) }
          exchangeRate={ 'exchange_rate' in data ? data.exchange_rate : null }
          loading={ isLoading }
          accuracy={ 0 }
          gweiValue
          flexWrap="wrap"
          mr={ 3 }
          rowGap={ 0 }
        />
        <DetailedInfoItemBreakdown.Container loading={ isLoading }>
          <DetailedInfoItemBreakdown.Row
            label="Base fee"
            hint="The minimum network fee charged per transaction"
          >
            <AssetValue
              amount={ BigNumber(data.base_fee_per_gas || 0).multipliedBy(data.gas_used || 0).toString() }
              asset={ currencyUnits.ether }
              decimals={ String(config.chain.currency.decimals) }
              exchangeRate={ 'exchange_rate' in data ? data.exchange_rate : null }
              accuracy={ 0 }
              loading={ isLoading }
              gweiValue
              flexWrap="wrap"
              rowGap={ 0 }
            />
          </DetailedInfoItemBreakdown.Row>
          <DetailedInfoItemBreakdown.Row
            label="Priority fee"
            hint="An extra fee set by the sender to speed up transaction execution"
          >
            <AssetValue
              amount={ data.priority_fee || '0' }
              asset={ currencyUnits.ether }
              decimals={ String(config.chain.currency.decimals) }
              exchangeRate={ 'exchange_rate' in data ? data.exchange_rate : null }
              accuracy={ 0 }
              loading={ isLoading }
              gweiValue
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
