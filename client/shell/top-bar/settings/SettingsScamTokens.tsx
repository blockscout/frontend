// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { useAppContext } from 'client/shell/app/context';

import config from 'client/config';
import * as cookies from 'client/shared/storage/cookies';

import { Switch } from 'toolkit/chakra/switch';

const SettingsScamTokens = () => {
  const { cookies: appCookies } = useAppContext();

  const initialValue = cookies.get(cookies.NAMES.SHOW_SCAM_TOKENS, appCookies);

  const [ isChecked, setIsChecked ] = React.useState(initialValue !== 'true');

  const handleChange = React.useCallback(() => {
    setIsChecked(prev => {
      const nextValue = !prev;
      cookies.set(cookies.NAMES.SHOW_SCAM_TOKENS, nextValue ? 'false' : 'true');
      return nextValue;
    });
    window.location.reload();
  }, []);

  if (!config.slices.token.hideScamTokensEnabled) {
    return null;
  }

  return (
    <Switch
      id="scam-tokens"
      checked={ isChecked }
      onChange={ handleChange }
      direction="rtl"
      justifyContent="space-between"
      w="100%"
      minH="34px"
    >
      Hide scam tokens
    </Switch>
  );
};

export default React.memo(SettingsScamTokens);
