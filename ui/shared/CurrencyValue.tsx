import { Box, Text, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { WEI, GWEI } from 'lib/consts';

interface Props {
  value: string;
  unit?: 'wei' | 'gwei' | 'ether';
  currency?: string;
  exchangeRate?: string;
  className?: string;
  accuracy?: number;
  accuracyUsd?: number;
}

const CurrencyValue = ({ value, currency = '', unit = 'wei', exchangeRate, className, accuracy, accuracyUsd }: Props) => {
  let unitBn: BigNumber.Value;
  switch (unit) {
    case 'wei':
      unitBn = WEI;
      break;
    case 'gwei':
      unitBn = GWEI;
      break;
    default:
      unitBn = new BigNumber(1);
  }

  const valueBn = new BigNumber(value);
  const valueCurr = valueBn.dividedBy(unitBn);
  const exchangeRateBn = new BigNumber(exchangeRate || 0);
  const usdBn = valueCurr.times(exchangeRateBn);

  return (
    <Box as="span" className={ className } display="inline-flex" rowGap={ 3 } columnGap={ 1 }>
      <Text as="span">
        { accuracy ? valueCurr.toFixed(accuracy) : valueCurr.toFixed() }{ currency ? ` ${ currency }` : '' }
      </Text>
      { exchangeRate !== undefined && exchangeRate !== null &&
        // TODO: mb need to implement rounding to the first significant digit
        <Text as="span" variant="secondary" fontWeight={ 400 }>(${ accuracyUsd ? usdBn.toFixed(accuracyUsd) : usdBn.toFixed() })</Text>
      }
    </Box>
  );
};

export default React.memo(chakra(CurrencyValue));
