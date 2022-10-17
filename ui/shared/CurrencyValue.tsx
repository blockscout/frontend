import { Box, Text, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Unit } from 'types/unit';

import getValueWithUnit from 'lib/getValueWithUnit';

interface Props {
  value: string;
  unit?: Unit;
  currency?: string;
  exchangeRate?: string | null;
  className?: string;
  accuracy?: number;
  accuracyUsd?: number;
}

const CurrencyValue = ({ value, currency = '', unit, exchangeRate, className, accuracy, accuracyUsd }: Props) => {
  const valueCurr = getValueWithUnit(value, unit);
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
      <Text as="span" variant="secondary" whiteSpace="pre" fontWeight={ 400 }> (${ usdResult })</Text>
    );
  }

  return (
    <Box as="span" className={ className }>
      <Text display="inline-block">
        { valueResult }{ currency ? ` ${ currency }` : '' }
      </Text>
      { usdContent }
    </Box>
  );
};

export default React.memo(chakra(CurrencyValue));
