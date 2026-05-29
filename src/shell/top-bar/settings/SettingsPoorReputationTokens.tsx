// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { useAppContext } from 'src/shell/app/context';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

import { Switch } from 'src/toolkit/chakra/switch';

const SettingsPoorReputationTokens = () => {
  const { cookies: appCookies } = useAppContext();

  const initialValue = cookies.get(cookies.NAMES.SHOW_POOR_REPUTATION_TOKENS, appCookies);

  const [ isChecked, setIsChecked ] = React.useState(initialValue !== 'true');

  const handleChange = React.useCallback(() => {
    setIsChecked(prev => !prev);
    const nextValue = !isChecked;
    cookies.set(cookies.NAMES.SHOW_POOR_REPUTATION_TOKENS, nextValue ? 'false' : 'true');
    window.location.reload();
  }, [ isChecked ]);

  if (!config.features.multichain.isEnabled) {
    return null;
  }

  return (
    <Switch
      id="poor-reputation-tokens"
      checked={ isChecked }
      onChange={ handleChange }
      direction="rtl"
      justifyContent="space-between"
      w="100%"
      minH="34px"
    >
      Hide poor reputation tokens
    </Switch>
  );
};

export default React.memo(SettingsPoorReputationTokens);
