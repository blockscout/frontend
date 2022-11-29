import { Box, Text, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

interface Props {
  value: string;
  currency?: string;
  exchangeRate?: string | null;
  className?: string;
  accuracy?: number;
  accuracyUsd?: number;
  decimals?: string | null;
}

const CurrencyValue = ({ value, currency = '', decimals, exchangeRate, className, accuracy, accuracyUsd }: Props) => {
  if (value === undefined || value === null) {
    return (
      <Box as="span" className={ className }>
        <Text>N/A</Text>
      </Box>
    );
  }
  const valueCurr = BigNumber(value).div(BigNumber(10 ** Number(decimals || '18')));
  const valueResult = accuracy ? valueCurr.dp(accuracy).toFormat() : valueCurr.toFormat();

  let usdContent;
  if (exchangeRate !== undefined && exchangeRate !== null) {
    const exchangeRateBn = new BigNumber(exchangeRate);
    const usdBn = valueCurr.times(exchangeRateBn);
    let usdResult: string;
    if (accuracyUsd && !usdBn.isEqualTo(0)) {
      const usdBnDp = usdBn.dp(accuracyUsd);
      usdResult = usdBnDp.isEqualTo(0) ? usdBn.precision(accuracyUsd).toFormat() : usdBnDp.toFormat();
    } else {
      usdResult = usdBn.toFormat();
    }

    usdContent = (
      <Text as="span" variant="secondary" fontWeight={ 400 }>(${ usdResult })</Text>
    );
  }

  return (
    <Box as="span" className={ className } display="inline-flex" rowGap={ 3 } columnGap={ 1 }>
      <Text display="inline-block">
        { valueResult }{ currency ? ` ${ currency }` : '' }
      </Text>
      { usdContent }
    </Box>
  );
};

export default React.memo(chakra(CurrencyValue));
