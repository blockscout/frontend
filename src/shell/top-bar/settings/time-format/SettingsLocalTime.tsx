// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { Switch } from 'src/toolkit/chakra/switch';

import { useSettingsContext } from '../context';

const SettingsLocalTime = () => {
  const settingsContext = useSettingsContext();

  if (!settingsContext) {
    return null;
  }

  const { isLocalTime, toggleIsLocalTime } = settingsContext;

  return (
    <Switch
      id="local-time"
      defaultChecked={ isLocalTime }
      onChange={ toggleIsLocalTime }
      direction="rtl"
      justifyContent="space-between"
      w="100%"
      minH="34px"
    >
      Local time format
    </Switch>
  );
};

export default React.memo(SettingsLocalTime);
