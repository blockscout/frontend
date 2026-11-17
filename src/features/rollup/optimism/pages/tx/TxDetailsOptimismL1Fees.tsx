// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { currencyUnits } from 'src/slices/chain/units';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoNativeCoinValue from 'src/shared/detailed-info/DetailedInfoNativeCoinValue';
import GasPriceValue from 'src/shared/values/entity/GasPriceValue';

const rollupFeature = config.features.rollup;

interface Props {
  data: Pick<
    schemas['TransactionResponse'],
    'l1_gas_used' | 'l1_gas_price' | 'l1_fee' | 'l1_fee_scalar' | 'exchange_rate' | 'historic_exchange_rate'
  >;
  isLoading: boolean;
}

const TxDetailsOptimismL1Fees = ({ data, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  const hiddenFields = config.slices.tx.hiddenFields;
  const parentChainCurrency = rollupFeature.parentChain.currency;

  return (
    <>
      { data.l1_gas_used && !hiddenFields?.L1_gas_used && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `${ layerLabels.parent } gas used by transaction` }
            isLoading={ isLoading }
          >
            { layerLabels.parent } gas used by txn
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Text>{ BigNumber(data.l1_gas_used).toFormat() }</Text>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.l1_gas_price && !hiddenFields?.L1_gas_price && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `${ layerLabels.parent } gas price` }
            isLoading={ isLoading }
          >
            { layerLabels.parent } gas price
          </DetailedInfo.ItemLabel>
          <GasPriceValue
            amount={ data.l1_gas_price }
            asset={ parentChainCurrency?.symbol || currencyUnits.ether }
            loading={ isLoading }
          />
        </>
      ) }

      { data.l1_fee && !hiddenFields?.L1_fee && (
        <>
          <DetailedInfo.ItemLabel
            // eslint-disable-next-line max-len -- the hint is one sentence of user-facing copy
            hint={ `${ layerLabels.parent } Data Fee which is used to cover the ${ layerLabels.parent } "security" cost from the batch submission mechanism. In combination with ${ layerLabels.current } execution fee, ${ layerLabels.parent } fee makes the total amount of fees that a transaction pays.` }
            isLoading={ isLoading }
          >
            { layerLabels.parent } fee
          </DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.l1_fee }
            asset={ parentChainCurrency?.symbol || currencyUnits.ether }
            decimals={ parentChainCurrency?.decimals ?? config.chain.currency.decimals }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }

      { data.l1_fee_scalar && !hiddenFields?.L1_fee_scalar && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `A Dynamic overhead (fee scalar) premium, which serves as a buffer in case ${ layerLabels.parent } prices rapidly increase.` }
            isLoading={ isLoading }
          >
            { layerLabels.parent } fee scalar
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Text>{ data.l1_fee_scalar }</Text>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(TxDetailsOptimismL1Fees);
