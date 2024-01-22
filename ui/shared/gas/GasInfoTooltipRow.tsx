import { GridItem, chakra } from '@chakra-ui/react';
import React from 'react';

import type { GasPriceInfo } from 'types/api/stats';

import { asymp, space } from 'lib/html-entities';
import GasPrice from 'ui/shared/gas/GasPrice';

interface Props {
  name: string;
  info: GasPriceInfo | null;
}

const GasInfoTooltipRow = ({ name, info }: Props) => {
  const content = (() => {
    if (!info || info.price === null) {
      return 'N/A';
    }

    return (
      <>
        <GasPrice data={ info }/>
        { info.time && (
          <chakra.span color="text_secondary">
            { space }per tx { asymp } { (info.time / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 }) }s
          </chakra.span>
        ) }
      </>
    );
  })();

  return (
    <>
      <GridItem color="blue.100">{ name }</GridItem>
      <GridItem color="text" textAlign="right">{ content }</GridItem>
    </>
  );
};

export default React.memo(GasInfoTooltipRow);
