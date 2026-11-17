// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { currencyUnits } from 'src/slices/chain/units';
import getChainValidatorTitle from 'src/slices/chain/verification-type/utils/get-chain-validator-title';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import TextSeparator from 'src/shared/texts/TextSeparator';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'base_fee_per_gas' | 'max_fee_per_gas' | 'max_priority_fee_per_gas'>;
  isLoading: boolean;
}

const TxDetailsGasFees = ({ data, isLoading }: Props) => {
  if (config.slices.tx.hiddenFields?.gas_fees || !(data.base_fee_per_gas || data.max_fee_per_gas || data.max_priority_fee_per_gas)) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ `
            Base Fee refers to the network Base Fee at the time of the block,
            while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay
            for their tx & to give to the ${ getChainValidatorTitle() } respectively
          ` }
        isLoading={ isLoading }
      >
        { `Gas fees (${ currencyUnits.gwei })` }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        { data.base_fee_per_gas && (
          <NativeCoinValue
            amount={ data.base_fee_per_gas }
            units="gwei"
            unitsTooltip="wei"
            noSymbol
            loading={ isLoading }
            startElement="Base: "
            endElement={ (data.max_fee_per_gas || data.max_priority_fee_per_gas) && <TextSeparator/> }
          />
        ) }
        { data.max_fee_per_gas && (
          <NativeCoinValue
            amount={ data.max_fee_per_gas }
            units="gwei"
            unitsTooltip="wei"
            noSymbol
            loading={ isLoading }
            startElement="Max: "
            endElement={ data.max_priority_fee_per_gas && <TextSeparator/> }
          />
        ) }
        { data.max_priority_fee_per_gas && (
          <NativeCoinValue
            amount={ data.max_priority_fee_per_gas }
            units="gwei"
            unitsTooltip="wei"
            noSymbol
            loading={ isLoading }
            startElement="Max priority: "
          />
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsGasFees);
