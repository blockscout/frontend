// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import SettingsLocalTime from '../../fields/time-format/SettingsLocalTime';
import SettingsSectionTitle from '../../parts/SettingsSectionTitle';

const SettingsModalTimeFormatTab = () => {
  const isMobile = useIsMobile();
  return (
    <>
      { !isMobile && <SettingsSectionTitle title="Time format" variant="modal"/> }
      <SettingsLocalTime/>
    </>
  );
};

export default React.memo(SettingsModalTimeFormatTab);
