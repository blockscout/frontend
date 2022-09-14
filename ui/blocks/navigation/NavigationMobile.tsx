import { Box, VStack } from '@chakra-ui/react';
import React from 'react';

import * as cookies from 'lib/cookies';
import useNavItems from 'lib/hooks/useNavItems';
import useNetwork from 'lib/hooks/useNetwork';
import NavFooter from 'ui/blocks/navigation/NavFooter';
import NavLink from 'ui/blocks/navigation/NavLink';

const NavigationMobile = () => {
  const { mainNavItems, accountNavItems } = useNavItems();
  const selectedNetwork = useNetwork();

  const isAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN));
  const hasAccount = selectedNetwork?.isAccountSupported && isAuth;

  return (
    <>
      <Box as="nav" mt={ 6 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { mainNavItems.map((item) => <NavLink key={ item.text } { ...item }/>) }
        </VStack>
      </Box>
      { isAuth && (
        <Box as="nav" mt={ 6 }>
          <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
            { accountNavItems.map((item) => <NavLink key={ item.text } { ...item }/>) }
          </VStack>
        </Box>
      ) }
      <NavFooter hasAccount={ hasAccount }/>
    </>
  );
};

export default NavigationMobile;
