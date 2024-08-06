import { Tooltip, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import colors from 'theme/foundations/colors';
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
      color: useColorModeValue('green.500', colors.success[200]), //'green.200'
      bgColor: useColorModeValue('green.50', colors.success[600]), //'green.800'
    },
    out: {
      color: useColorModeValue('yellow.600', colors.yellow[200]), //'yellow.500'
      bgColor: useColorModeValue('orange.50', colors.yellow[600]), //'yellow.900'
    },
    self: {
      color: useColorModeValue('blackAlpha.400', colors.grayTrue[200]), //'whiteAlpha.400'
      bgColor: useColorModeValue('blackAlpha.50', colors.grayTrue[600]), //'whiteAlpha.50'
    },
    unspecified: {
      color: useColorModeValue('gray.500', colors.grayTrue[200]), //'gray.300'
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
