// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { TxCourseType } from 'src/slices/address/utils/tx';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  isLoading?: boolean;
  type: TxCourseType;
  className?: string;
}

const AddressFromToIcon = ({ isLoading, type, className }: Props) => {
  const styles = {
    'in': {
      color: 'badge.teal.fg',
      bgColor: 'badge.teal.bg',
    },
    out: {
      color: 'badge.yellow.fg',
      bgColor: 'badge.yellow.bg',
    },
    self: {
      color: 'badge.gray.fg',
      bgColor: 'badge.gray.bg',
    },
    unspecified: {
      color: 'icon.primary',
      bgColor: 'transparent',
    },
  };
  const labels = {
    'in': 'Incoming txn',
    out: 'Outgoing txn',
    self: 'Txn to the same address',
  };

  const icon = (
    <SpriteIcon
      name="arrows/east"
      { ...(styles[type]) }
      className={ className }
      isLoading={ isLoading }
      boxSize={ 5 }
      flexShrink={ 0 }
      borderRadius="sm"
    />
  );

  if (type === 'unspecified') {
    return icon;
  }

  return (
    <Tooltip content={ labels[type] }>
      { icon }
    </Tooltip>
  );
};

export default React.memo(chakra(AddressFromToIcon));
