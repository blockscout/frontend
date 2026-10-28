// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import type { SettingsControlVariant } from '../types';

import type { IconName } from 'src/sprite/SpriteIcon';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Heading } from 'src/toolkit/chakra/heading';

interface Props {
  variant: SettingsControlVariant;
  title: string;
  icon?: IconName;
  description?: string;
}

const SettingsSectionTitle = ({ variant, title, icon, description }: Props) => {
  return variant === 'modal' ? (
    <VStack alignItems="stretch" mb={{ base: 3, lg: 6 }}>
      <HStack>
        { icon && <SpriteIcon name={ icon } boxSize={ 5 }/> }
        <Heading level="3">{ title }</Heading>
      </HStack>
      { description && <Text textStyle="sm">{ description }</Text> }
    </VStack>
  ) : (
    <Box fontWeight="semibold">{ title }</Box>
  );
};

export default React.memo(SettingsSectionTitle);
