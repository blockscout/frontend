// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import AddressFromToTag from 'src/slices/address/components/from-to/AddressFromToTag';
import type { TxCourseType } from 'src/slices/address/utils/tx';

import type { BadgeProps } from 'src/toolkit/chakra/badge';

interface Props extends BadgeProps {
  currentAddress: string;
  sender?: string;
  recipient?: string;
  isLoading?: boolean;
}

const CrossChainFromToTag = ({ currentAddress, sender, recipient, isLoading, ...rest }: Props) => {

  const type: Exclude<TxCourseType, 'unspecified'> = (() => {
    if (sender?.toLowerCase() === currentAddress.toLowerCase() && recipient?.toLowerCase() === currentAddress.toLowerCase()) {
      return 'self';
    }

    if (sender?.toLowerCase() === currentAddress.toLowerCase()) {
      return 'out';
    }

    if (recipient?.toLowerCase() === currentAddress.toLowerCase()) {
      return 'in';
    }

    return 'self';
  })();

  return <AddressFromToTag type={ type } isLoading={ isLoading } { ...rest }/>;
};

export default React.memo(CrossChainFromToTag);
