// SPDX-License-Identifier: LicenseRef-Blockscout

import { VStack } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import SettingsPoorReputationTokens from '../../fields/SettingsPoorReputationTokens';
import SettingsScamTokens from '../../fields/SettingsScamTokens';
import SettingsSectionTitle from '../../parts/SettingsSectionTitle';

const SettingsModalScamTokensTab = () => {
  const isMobile = useIsMobile();
  return (
    <>
      { !isMobile && (
        <SettingsSectionTitle
          title="Scam tokens"
          description="Tokens flagged as scam are hidden from token lists and balances."
          variant="modal"
        />
      ) }
      <VStack gap={ 1 } alignItems="stretch">
        <SettingsScamTokens/>
        <SettingsPoorReputationTokens/>
      </VStack>
    </>
  );
};

export default React.memo(SettingsModalScamTokensTab);
