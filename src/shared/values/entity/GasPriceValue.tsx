// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { useCurrencyUnits } from 'src/slices/chain/useCurrencyUnits';

import { thinsp } from 'src/toolkit/utils/htmlEntities';

import SimpleValue from './SimpleValue';
import { GWEI, WEI } from './utils';

export interface Props extends Omit<BoxProps, 'prefix' | 'suffix'> {
  amount: string;
  asset?: string;
  accuracy?: number;
  noTooltip?: boolean;
  loading?: boolean;
}

const GasPriceValue = ({
  amount,
  asset: assetProp,
  accuracy = 0,
  noTooltip,
  loading,
  ...rest
}: Props) => {
  const currencyUnits = useCurrencyUnits();
  const asset = assetProp ?? currencyUnits.ether;

  return (
    <chakra.span
      display="inline-flex"
      flexWrap="wrap"
      flexDirection="row"
      alignItems="center"
      maxW="100%"
      columnGap={ 1 }
      { ...rest }
    >
      <SimpleValue
        value={ BigNumber(amount).div(WEI) }
        accuracy={ accuracy }
        endElement={ asset ? `${ thinsp }${ asset }` : undefined }
        noTooltip={ noTooltip }
        loading={ loading }
      />
      <SimpleValue
        value={ BigNumber(amount).div(GWEI) }
        accuracy={ accuracy }
        startElement={ <span>(</span> }
        endElement={ `${ thinsp }${ currencyUnits.gwei })` }
        noTooltip={ noTooltip }
        loading={ loading }
        color="text.secondary"
      />
    </chakra.span>
  );
};

export default React.memo(GasPriceValue);
