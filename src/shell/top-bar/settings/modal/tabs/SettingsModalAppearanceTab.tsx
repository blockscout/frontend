// SPDX-License-Identifier: LicenseRef-Blockscout

import { Separator, VStack } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import SettingsColorTheme from '../../fields/color-theme/SettingsColorTheme';
import SettingsIdentIcon from '../../fields/ident-icon/SettingsIdentIcon';
import SettingsAddressFormat from '../../fields/SettingsAddressFormat';

const SettingsModalAppearanceTab = () => {
  const isMobile = useIsMobile();

  return (
    <VStack gap={{ base: 3, lg: 6 }} alignItems="stretch" separator={ isMobile ? undefined : <Separator/> }>
      <SettingsColorTheme variant="modal"/>
      <SettingsIdentIcon variant="modal"/>
      <SettingsAddressFormat variant="modal"/>
    </VStack>
  );
};

export default React.memo(SettingsModalAppearanceTab);
