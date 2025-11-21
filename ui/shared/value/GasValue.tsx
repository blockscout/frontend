import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';

import SimpleValue from './SimpleValue';

export interface Props extends Omit<BoxProps, 'prefix' | 'suffix'> {
  amount: string;
  asset?: string;
  accuracy?: number;
  decimals?: string;
  gweiDecimals?: string;
  noTooltip?: boolean;
  loading?: boolean;
}

const GasValue = ({
  amount,
  asset = currencyUnits.ether,
  accuracy = 0,
  decimals = String(config.chain.currency.decimals),
  gweiDecimals = '9',
  noTooltip = true,
  loading,
  ...rest
}: Props) => {
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
        value={ BigNumber(amount).div(BigNumber(10).pow(Number(decimals))) }
        accuracy={ accuracy }
        endElement={ asset ? ` ${ asset }` : undefined }
        noTooltip={ noTooltip }
        loading={ loading }
      />
      <SimpleValue
        value={ BigNumber(amount).div(BigNumber(10).pow(Number(gweiDecimals))) }
        accuracy={ accuracy }
        startElement={ <span>(</span> }
        endElement={ ` ${ currencyUnits.gwei })` }
        noTooltip={ noTooltip }
        loading={ loading }
        color="text.secondary"
      />
    </chakra.span>
  );
};

export default React.memo(GasValue);
