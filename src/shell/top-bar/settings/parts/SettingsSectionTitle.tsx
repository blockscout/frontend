// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import type { SettingsControlVariant } from '../types';

import { Heading } from 'src/toolkit/chakra/heading';

interface Props {
  variant: SettingsControlVariant;
  title: string;
  description?: string;
}

const SettingsSectionTitle = ({ variant, title, description }: Props) => {
  return variant === 'modal' ? (
    <VStack alignItems="stretch" mb={{ base: 3, lg: 6 }}>
      <Heading level="3">{ title }</Heading>
      { description && <Text textStyle="sm">{ description }</Text> }
    </VStack>
  ) : (
    <Box fontWeight="semibold">{ title }</Box>
  );
};

export default React.memo(SettingsSectionTitle);
