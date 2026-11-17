// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { currencyUnits } from 'src/slices/chain/units';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoNativeCoinValue from 'src/shared/detailed-info/DetailedInfoNativeCoinValue';
import TextSeparator from 'src/shared/texts/TextSeparator';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

interface Props {
  data: Pick<
    schemas['TransactionResponse'],
    'blob_gas_used' | 'blob_gas_price' | 'max_fee_per_blob_gas' | 'exchange_rate' | 'historic_exchange_rate'
  >;
  isLoading: boolean;
}

const TxDetailsBlobFees = ({ data, isLoading }: Props) => {
  if (!data.blob_gas_used && !data.max_fee_per_blob_gas && !data.blob_gas_price) {
    return null;
  }

  return (
    <>
      { data.blob_gas_used && data.blob_gas_price && (
        <>
          <DetailedInfo.ItemLabel
            hint="Blob fee for this transaction"
          >
            Blob fee
          </DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ BigNumber(data.blob_gas_used).multipliedBy(data.blob_gas_price).toString() }
            noSymbol={ config.slices.tx.hiddenFields?.fee_currency }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }

      { data.blob_gas_used && (
        <>
          <DetailedInfo.ItemLabel
            hint="Amount of gas used by the blobs in this transaction"
          >
            Blob gas usage
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { BigNumber(data.blob_gas_used).toFormat() }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { (data.max_fee_per_blob_gas || data.blob_gas_price) && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `Amount of ${ currencyUnits.ether } used for blobs in this transaction` }
          >
            { `Blob gas fees (${ currencyUnits.gwei })` }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.blob_gas_price && (
              <NativeCoinValue
                amount={ data.blob_gas_price }
                units="gwei"
                unitsTooltip="wei"
                noSymbol
                loading={ isLoading }
                fontWeight="600"
              />
            ) }
            { (data.max_fee_per_blob_gas && data.blob_gas_price) && <TextSeparator/> }
            { data.max_fee_per_blob_gas && (
              <NativeCoinValue
                amount={ data.max_fee_per_blob_gas }
                units="gwei"
                unitsTooltip="wei"
                noSymbol
                loading={ isLoading }
                startElement="Max: "
                fontWeight="600"
              />
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }
      <DetailedInfo.ItemDivider/>
    </>
  );
};

export default React.memo(TxDetailsBlobFees);
