// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { Badge, type BadgeProps } from 'src/toolkit/chakra/badge';

const SELF_TAG = { text: 'Self', colorPalette: 'gray' as const };
const OUT_TAG = { text: 'Out', colorPalette: 'orange' as const };
const IN_TAG = { text: 'In', colorPalette: 'purple' as const };

interface Props extends BadgeProps {
  currentAddress: string;
  sender?: string;
  recipient?: string;
  isLoading?: boolean;
}

const CrossChainFromToTag = ({ currentAddress, sender, recipient, isLoading, ...rest }: Props) => {

  const { text, colorPalette } = (() => {
    if (sender?.toLowerCase() === currentAddress.toLowerCase() && recipient?.toLowerCase() === currentAddress.toLowerCase()) {
      return SELF_TAG;
    }

    if (sender?.toLowerCase() === currentAddress.toLowerCase()) {
      return OUT_TAG;
    }

    if (recipient?.toLowerCase() === currentAddress.toLowerCase()) {
      return IN_TAG;
    }

    return SELF_TAG;
  })();

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

export default React.memo(CrossChainFromToTag);
