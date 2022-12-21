import { Box, VStack } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import * as cookies from 'lib/cookies';
import useNavItems from 'lib/hooks/useNavItems';
import NavFooter from 'ui/snippets/navigation/NavFooter';
import NavLink from 'ui/snippets/navigation/NavLink';

const NavigationMobile = () => {
  const { mainNavItems, accountNavItems } = useNavItems();

  const isAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN));
  const hasAccount = appConfig.isAccountSupported && isAuth;

  return (
    <>
      <Box as="nav" mt={ 6 }>
        <VStack as="ul" spacing="1" alignItems="flex-start">
          { mainNavItems.map((item) => <NavLink key={ item.text } { ...item }/>) }
        </VStack>
      </Box>
      { isAuth && (
        <Box as="nav" mt={ 6 }>
          <VStack as="ul" spacing="1" alignItems="flex-start">
            { accountNavItems.map((item) => <NavLink key={ item.text } { ...item }/>) }
          </VStack>
        </Box>
      ) }
      <NavFooter hasAccount={ hasAccount }/>
    </>
  );
};

export default NavigationMobile;
