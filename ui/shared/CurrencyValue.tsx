import { Box, Text, chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import getCurrencyValue from 'lib/getCurrencyValue';

interface Props {
  value: string;
  currency?: string;
  exchangeRate?: string | null;
  className?: string;
  accuracy?: number;
  accuracyUsd?: number;
  decimals?: string | null;
  isLoading?: boolean;
}

const CurrencyValue = ({ value, currency = '', decimals, exchangeRate, className, accuracy, accuracyUsd, isLoading }: Props) => {
  if (isLoading) {
    return (
      <Skeleton className={ className } display="inline-block">0.00 ($0.00)</Skeleton>
    );
  }

  if (value === undefined || value === null) {
    return (
      <Box as="span" className={ className }>
        <Text>N/A</Text>
      </Box>
    );
  }
  const { valueStr: valueResult, usd: usdResult } = getCurrencyValue({ value, accuracy, accuracyUsd, exchangeRate, decimals });

  return (
    <Box as="span" className={ className } display="inline-flex" rowGap={ 3 } columnGap={ 1 }>
      <Text display="inline-block">
        { valueResult }{ currency ? ` ${ currency }` : '' }
      </Text>
      { usdResult && <Text as="span" variant="secondary" fontWeight={ 400 }>(${ usdResult })</Text> }
    </Box>
  );
};

export default React.memo(chakra(CurrencyValue));
