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
  const valueResult = parseFloat(accuracy ? valueCurr.toFixed(accuracy) : valueCurr.toFixed());

  let usdContent;
  if (exchangeRate !== undefined && exchangeRate !== null) {
    const exchangeRateBn = new BigNumber(exchangeRate);
    const usdBn = valueCurr.times(exchangeRateBn);
    const usdResult = parseFloat(accuracyUsd ? usdBn.toFixed(accuracyUsd) : usdBn.toFixed());
    usdContent = (
      <Text as="span" variant="secondary" whiteSpace="pre" fontWeight={ 400 }> (${ usdResult })</Text>
    );
  }

  return (
    <Box as="span" className={ className }>
      <Text as="span">
        { valueResult }{ currency ? ` ${ currency }` : '' }
      </Text>
      { usdContent }
    </Box>
  );
};

export default React.memo(chakra(CurrencyValue));
