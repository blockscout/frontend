import { FormLabel, FormControl, Switch, Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';

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

  if (!config.UI.views.token.hideScamTokensEnabled) {
    return null;
  }

  return (
    <>
      <Box borderColor="divider" borderTopWidth="1px" my={ 3 }/>
      <FormControl display="flex" alignItems="center" columnGap={ 2 } mt={ 4 }>
        <FormLabel htmlFor="scam-tokens" m="0" fontWeight={ 400 } fontSize="sm" lineHeight={ 5 }>
          Hide scam tokens
        </FormLabel>
        <Switch id="scam-tokens" isChecked={ isChecked } onChange={ handleChange }/>
      </FormControl>
    </>
  );
};

export default React.memo(SettingsScamTokens);
