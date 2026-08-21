// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { SwitchProps } from 'src/toolkit/chakra/switch';
import { Switch } from 'src/toolkit/chakra/switch';

import { useSettingsContext } from '../context';

const SettingsLocalTime = (props: SwitchProps) => {
  const settingsContext = useSettingsContext();

  if (!settingsContext) {
    return null;
  }

  const { isLocalTime, toggleIsLocalTime } = settingsContext;

  return (
    <Switch
      id="local-time"
      checked={ isLocalTime }
      onCheckedChange={ toggleIsLocalTime }
      direction="rtl"
      justifyContent="space-between"
      w="100%"
      minH="34px"
      { ...props }
    >
      Local time format
    </Switch>
  );
};

export default React.memo(SettingsLocalTime);
