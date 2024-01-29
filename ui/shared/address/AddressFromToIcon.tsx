import { Tooltip, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import type { TxCourseType } from './utils';

interface Props {
  isLoading?: boolean;
  type: TxCourseType;
  className?: string;
}

const AddressFromToIcon = ({ isLoading, type, className }: Props) => {
  const styles = {
    'in': {
      color: useColorModeValue('green.500', 'green.200'),
      bgColor: useColorModeValue('green.50', 'green.800'),
    },
    out: {
      color: useColorModeValue('yellow.600', 'yellow.500'),
      bgColor: useColorModeValue('orange.50', 'yellow.900'),
    },
    self: {
      color: useColorModeValue('blackAlpha.400', 'whiteAlpha.400'),
      bgColor: useColorModeValue('blackAlpha.50', 'whiteAlpha.50'),
    },
    unspecified: {
      color: useColorModeValue('gray.500', 'gray.300'),
      bgColor: 'transparent',
    },
  };
  const labels = {
    'in': 'Incoming txn',
    out: 'Outgoing txn',
    self: 'Txn to the same address',
  };

  const icon = (
    <IconSvg
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
    <Tooltip label={ labels[type] }>
      { icon }
    </Tooltip>
  );
};

export default React.memo(chakra(AddressFromToIcon));
