// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { SettingsControlVariant } from '../types';

interface Props {
  variant: SettingsControlVariant;
  value: string | undefined;
  prefix?: string;
}

const SettingsSampleValue = ({ variant, value, prefix }: Props) => {
  if (variant === 'modal') {
    return (
      <Box color="text.secondary" textStyle="sm" mb={{ base: 2, lg: 3 }}>{ prefix } { value }</Box>
    );
  }

  return (
    <Box color="text.secondary" mt={ 1 } mb={ 2 }>{ prefix } { value }</Box>
  );
};

export default React.memo(SettingsSampleValue);
