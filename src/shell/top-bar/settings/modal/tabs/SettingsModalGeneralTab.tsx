// SPDX-License-Identifier: LicenseRef-Blockscout

import { VStack } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import SettingsColorTheme from '../../fields/color-theme/SettingsColorTheme';
import SettingsIdentIcon from '../../fields/ident-icon/SettingsIdentIcon';
import SettingsAddressFormat from '../../fields/SettingsAddressFormat';
import SettingsPoorReputationTokens from '../../fields/SettingsPoorReputationTokens';
import SettingsScamTokens from '../../fields/SettingsScamTokens';
import SettingsLocalTime from '../../fields/time-format/SettingsLocalTime';
import SettingsSectionTitle from '../../parts/SettingsSectionTitle';

const SettingsModalGeneralTab = () => {
  const isMobile = useIsMobile();

  return (
    <>
      { !isMobile && <SettingsSectionTitle title="General site settings" variant="modal"/> }
      <VStack gap={ 6 } alignItems="stretch">
        <SettingsColorTheme variant="modal"/>
        <SettingsIdentIcon variant="modal"/>
        <SettingsAddressFormat variant="modal"/>
        <SettingsScamTokens/>
        <SettingsPoorReputationTokens/>
        <SettingsLocalTime/>
      </VStack>
    </>
  );
};

export default React.memo(SettingsModalGeneralTab);
