import { Box, Text, chakra } from '@chakra-ui/react';
import { utils, constants } from 'ethers';
import React from 'react';

interface Props {
  value: string;
  unit?: 'wei' | 'gwei' | 'ether';
  currency?: string;
  exchangeRate?: string;
  className?: string;
}

const CurrencyValue = ({ value, currency = '', unit = 'wei', exchangeRate, className }: Props) => {
  const valueBn = utils.parseUnits(value, unit);
  const exchangeRateBn = utils.parseUnits(exchangeRate || '0', 'ether');
  const usdBn = valueBn.mul(exchangeRateBn).div(constants.WeiPerEther);

  return (
    <Box as="span" className={ className }>
      <Text as="span">
        { Number(utils.formatUnits(valueBn)).toLocaleString() }{ currency ? ` ${ currency }` : '' }</Text>
      { exchangeRate !== undefined && exchangeRate !== null &&
        <Text as="span" variant="secondary" whiteSpace="pre" fontWeight={ 400 }> (${ utils.formatUnits(usdBn) })</Text> }
    </Box>
  );
};

export default React.memo(chakra(CurrencyValue));
