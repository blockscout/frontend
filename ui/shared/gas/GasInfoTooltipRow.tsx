import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import type { GasPriceInfo } from 'types/api/stats';

import { space } from 'lib/html-entities';
import GasPrice from 'ui/shared/gas/GasPrice';

interface Props {
  name: string;
  info: GasPriceInfo | null;
}

const GasInfoTooltipRow = ({ name, info }: Props) => {
  return (
    <>
      <Box>
        <chakra.span>{ name }</chakra.span>
        { info && typeof info.time === 'number' && info.time > 0 && (
          <chakra.span color="text_secondary">
            { space }{ (info.time / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 }) }s
          </chakra.span>
        ) }
      </Box>
      <GasPrice data={ info } textAlign="right"/>
      <GasPrice data={ info } unitMode="secondary" color="text_secondary" textAlign="right"/>
    </>
  );
};

export default React.memo(GasInfoTooltipRow);
