import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import getCurrencyValue from 'lib/getCurrencyValue';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { GWEI } from 'toolkit/utils/consts';

interface Props extends BoxProps {
  value: string | null;
  currency?: string;
  decimals?: string | null;
  exchangeRate?: string | null;
  layout?: 'horizontal' | 'vertical';
  accuracy?: number;
  accuracyUsd?: number;
  isLoading?: boolean;
  startElement?: React.ReactNode;
  showGweiTooltip?: boolean;
  noValueTooltip?: boolean;
}

// TODO @tom2drum remove this component
const CurrencyValue = ({
  value,
  currency = '',
  decimals,
  exchangeRate,
  layout = 'horizontal',
  accuracy,
  accuracyUsd,
  isLoading,
  startElement,
  showGweiTooltip,
  noValueTooltip,
  ...rest
}: Props) => {
  if (isLoading) {
    return (
      <Skeleton loading display="inline-flex" { ...rest }><span>0.00 </span><span>($0.00)</span></Skeleton>
    );
  }

  if (value === undefined || value === null) {
    return (
      <chakra.span { ...rest }>
        -
      </chakra.span>
    );
  }
  const { valueCurr, valueStr: valueResult, usd: usdResult } = getCurrencyValue({ value, accuracy, accuracyUsd, exchangeRate, decimals });

  const mainElement = (() => {
    const valueElement = (
      <chakra.span display="inline-block" maxW="100%" overflow="hidden" textOverflow="ellipsis">
        { valueResult }{ currency ? ` ${ currency }` : '' }
      </chakra.span>
    );

    if (showGweiTooltip) {
      const valueInGwei = showGweiTooltip ? valueCurr.multipliedBy(GWEI).toFormat() : null;
      return (
        <Tooltip content={ `${ valueInGwei } ${ currencyUnits.gwei }` }>
          { valueElement }
        </Tooltip>
      );
    }

    if (!noValueTooltip) {
      return (
        <Tooltip content={ `${ valueCurr.toFormat() }${ currency ? ` ${ currency }` : '' }` }>
          { valueElement }
        </Tooltip>
      );
    }

    return valueElement;
  })();

  return (
    <chakra.span
      display="inline-flex"
      flexDirection={ layout === 'vertical' ? 'column' : 'row' }
      alignItems={ layout === 'vertical' ? 'flex-end' : 'center' }
      whiteSpace="pre"
      maxW="100%"
      overflow="hidden"
      textOverflow="ellipsis"
      { ...rest }
    >
      <chakra.span display="inline-flex" alignItems="center" overflow="hidden" maxW="100%">
        { startElement }
        { mainElement }
      </chakra.span>
      { usdResult && (
        <chakra.span color="text.secondary" maxW="100%" overflow="hidden" textOverflow="ellipsis">
          { layout === 'horizontal' ? ` ($${ usdResult })` : `$${ usdResult }` }
        </chakra.span>
      ) }
    </chakra.span>
  );
};

export default React.memo(CurrencyValue);
