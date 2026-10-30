// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SettingsControlVariant } from '../types';

import { Truncate } from 'src/toolkit/components/truncation/Truncate';

import SettingsSectionTitle from './SettingsSectionTitle';

interface Props {
  variant: SettingsControlVariant;
  title: string;
  mobileTitle: string;
  value: string | undefined;
  children: React.ReactNode;
}

const SettingsSamplesRow = ({ variant, title, mobileTitle, value, children }: Props) => {
  if (variant === 'modal') {
    return (
      <Flex alignItems="center" justifyContent="space-between" gap={{ base: 2, lg: 3 }} minH="48px">
        <Box minW={ 0 } textStyle="sm">
          <Box fontWeight="medium" hideBelow="lg">{ title }</Box>
          <Box fontWeight="medium" hideFrom="lg">{ mobileTitle }</Box>
          { value && <Truncate value={ value } color="text.secondary" type="end" maxW="100%" mt={ 1 }/> }
        </Box>
        <Flex gap={{ base: 1, lg: 2 }} flexShrink={ 0 }>{ children }</Flex>
      </Flex>
    );
  }

  return (
    <div>
      <SettingsSectionTitle variant={ variant } title={ title }/>
      <Box color="text.secondary" mt={ 1 } mb={ 2 }>{ value }</Box>
      <Flex>{ children }</Flex>
    </div>
  );
};

export default React.memo(SettingsSamplesRow);
