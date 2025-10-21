import { chakra } from '@chakra-ui/react';
import React from 'react';

import getCurrencyValue from 'lib/getCurrencyValue';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { GWEI } from 'toolkit/utils/consts';

interface Props {
  value: string | null;
  currency?: string;
  exchangeRate?: string | null;
  className?: string;
  accuracy?: number;
  accuracyUsd?: number;
  decimals?: string | null;
  isLoading?: boolean;
  startElement?: React.ReactNode;
  showGweiTooltip?: boolean;
}

const CurrencyValue = ({ value, currency = '', decimals, exchangeRate, className, accuracy, accuracyUsd, isLoading, startElement, showGweiTooltip }: Props) => {
  if (isLoading) {
    return (
      <Skeleton className={ className } loading display="inline-block">0.00 ($0.00)</Skeleton>
    );
  }

  if (value === undefined || value === null) {
    return (
      <chakra.span className={ className }>
        -
      </chakra.span>
    );
  }
  const { valueCurr, valueStr: valueResult, usd: usdResult } = getCurrencyValue({ value, accuracy, accuracyUsd, exchangeRate, decimals });

  const valueElement = (
    <chakra.span display="inline-block" maxW="100%" whiteSpace="pre" overflow="hidden" textOverflow="ellipsis">
      { valueResult }{ currency ? ` ${ currency }` : '' }
    </chakra.span>
  );
  const valueInGwei = showGweiTooltip ? valueCurr.multipliedBy(GWEI).toFormat() : null;

  return (
    <chakra.span className={ className } display="inline-flex" rowGap={ 3 } columnGap={ 1 }>
      { startElement }
      { showGweiTooltip ? (
        <Tooltip content={ `${ valueInGwei } ${ currencyUnits.gwei }` }>
          { valueElement }
        </Tooltip>
      ) : valueElement }
      { usdResult && <chakra.span color="text.secondary" fontWeight={ 400 }>(${ usdResult })</chakra.span> }
    </chakra.span>
  );
};

export default React.memo(chakra(CurrencyValue));
