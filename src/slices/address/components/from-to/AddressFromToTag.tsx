// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TxCourseType } from 'src/slices/address/utils/tx';

import { Badge, type BadgeProps } from 'src/toolkit/chakra/badge';

const TAGS = {
  'in': { text: 'In', colorPalette: 'teal' as const },
  out: { text: 'Out', colorPalette: 'yellow' as const },
  self: { text: 'Self', colorPalette: 'gray' as const },
};

interface Props extends BadgeProps {
  type: Exclude<TxCourseType, 'unspecified'>;
  isLoading?: boolean;
}

const AddressFromToTag = ({ type, isLoading, ...rest }: Props) => {
  const { text, colorPalette } = TAGS[type];

  return (
    <Badge
      loading={ isLoading }
      colorPalette={ colorPalette }
      minW={ 10 }
      justifyContent="center"
      { ...rest }
    >
      { text }
    </Badge>
  );
};

export default React.memo(AddressFromToTag);
