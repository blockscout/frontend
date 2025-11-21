import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import { currencyUnits } from 'lib/units';
import { GWEI } from 'toolkit/utils/consts';

import type { Params as CalculateUsdValueParams } from './calculateUsdValue';
import calculateUsdValue from './calculateUsdValue';
import SimpleValue from './SimpleValue';
import { DEFAULT_ACCURACY, DEFAULT_ACCURACY_USD, DEFAULT_DECIMALS } from './utils';

export interface Props extends Omit<BoxProps, 'prefix' | 'suffix'>, Omit<CalculateUsdValueParams, 'amount'> {
  amount: string | null | undefined;
  asset?: React.ReactNode;
  startElement?: React.ReactNode;
  noTooltip?: boolean;
  loading?: boolean;
  layout?: 'horizontal' | 'vertical';
  gweiValue?: boolean;
}

const AssetValue = ({
  amount,
  asset,
  decimals = DEFAULT_DECIMALS,
  accuracy = DEFAULT_ACCURACY,
  accuracyUsd = DEFAULT_ACCURACY_USD,
  startElement,
  noTooltip,
  loading,
  exchangeRate,
  layout = 'horizontal',
  gweiValue = false,
  ...rest
}: Props) => {

  if (amount === null || amount === undefined) {
    return <chakra.span { ...rest }>-</chakra.span>;
  }

  const { valueBn, usdBn } = calculateUsdValue({ amount, decimals, accuracy, accuracyUsd, exchangeRate });

  const tooltipContent = gweiValue ? `${ valueBn.multipliedBy(GWEI).toFormat() } ${ currencyUnits.gwei }` : undefined;

  if (!exchangeRate) {
    return (
      <SimpleValue
        value={ valueBn }
        accuracy={ accuracy }
        startElement={ startElement }
        endElement={ typeof asset === 'string' ? ` ${ asset }` : asset }
        tooltipContent={ tooltipContent }
        noTooltip={ noTooltip }
        loading={ loading }
        { ...rest }
      />
    );
  }

  return (
    <chakra.span
      display="inline-flex"
      flexDirection={ layout === 'vertical' ? 'column' : 'row' }
      alignItems={ layout === 'vertical' ? 'flex-end' : 'center' }
      maxW="100%"
      columnGap={ 1 }
      rowGap={ 1 }
      { ...rest }
    >
      <SimpleValue
        value={ valueBn }
        accuracy={ accuracy }
        startElement={ startElement }
        endElement={ typeof asset === 'string' ? ` ${ asset }` : asset }
        tooltipContent={ tooltipContent }
        noTooltip={ noTooltip }
        loading={ loading }
      />
      <SimpleValue
        value={ usdBn }
        accuracy={ accuracyUsd }
        startElement={ layout === 'horizontal' ? <span>(</span> : undefined }
        prefix="$"
        endElement={ layout === 'horizontal' ? <span>)</span> : undefined }
        noTooltip={ noTooltip }
        loading={ loading }
        color="text.secondary"
      />
    </chakra.span>
  );
};

export default React.memo(AssetValue);
