// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GridProps } from '@chakra-ui/react';
import { Grid } from '@chakra-ui/react';
import { clamp } from 'es-toolkit';
import React from 'react';

const MAX_COLUMNS_NUM = {
  desktop: 5,
  mobile: 2,
};

const GAPS = {
  desktop: 2 * 4,
  mobile: 1 * 4,
};

interface Props extends Omit<GridProps, 'columns'> {
  columnsNum?: {
    desktop: number;
    mobile: number;
  };
}

const StatsContainer = ({ columnsNum: columnsNumProp, ...rest }: Props) => {

  const columnNum = (() => {
    if (columnsNumProp) {
      return columnsNumProp;
    }

    const childrenNum = React.Children.toArray(rest.children).length;
    return {
      desktop: clamp(childrenNum, 1, MAX_COLUMNS_NUM.desktop),
      mobile: clamp(childrenNum, 1, MAX_COLUMNS_NUM.mobile),
    };
  })();

  const desktopColumnSize = `calc(${ 100 / columnNum.desktop }% - ${ (columnNum.desktop - 1) * GAPS.desktop }px / ${ columnNum.desktop })`;
  const mobileColumnSize = `calc(${ 100 / columnNum.mobile }% - ${ (columnNum.mobile - 1) * GAPS.mobile }px / ${ columnNum.mobile })`;

  return (
    <Grid
      gridTemplateColumns={{
        base: `repeat(${ columnNum.mobile }, ${ mobileColumnSize })`,
        lg: `repeat(${ columnNum.desktop }, ${ desktopColumnSize })`,
      }}
      gap={{ base: `${ GAPS.mobile }px`, lg: `${ GAPS.desktop }px` }}
      { ...rest }
    />
  );
};

export default React.memo(StatsContainer);
