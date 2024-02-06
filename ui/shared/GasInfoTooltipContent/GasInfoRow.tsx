import { GridItem, chakra } from '@chakra-ui/react';
import React from 'react';

import type { GasPriceInfo } from 'types/api/stats';

import { asymp, space } from 'lib/html-entities';
import { currencyUnits } from 'lib/units';

interface Props {
  name: string;
  info: GasPriceInfo | null;
}

const GasInfoRow = ({ name, info }: Props) => {
  const content = (() => {
    if (!info || info.price === null) {
      return 'N/A';
    }

    return (
      <>
        <span>{ info.fiat_price ? `$${ info.fiat_price }` : `${ info.price } ${ currencyUnits.gwei }` }</span>
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

export default React.memo(GasInfoRow);
