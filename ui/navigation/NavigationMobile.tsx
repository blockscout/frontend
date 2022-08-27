import { Box, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useNavItems from 'lib/hooks/useNavItems';
import NavFooter from 'ui/navigation/NavFooter';
import NavLink from 'ui/navigation/NavLink';

const NavigationMobile = () => {
  const { mainNavItems, accountNavItems } = useNavItems();
  const router = useRouter();

  return (
    <>
      <Box as="nav" mt={ 8 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { mainNavItems.map((item) => <NavLink key={ item.text } { ...item } isActive={ router.asPath === item.pathname }/>) }
        </VStack>
      </Box>
      <Box as="nav" mt={ 6 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { accountNavItems.map((item) => <NavLink key={ item.text } { ...item } isActive={ router.asPath === item.pathname }/>) }
        </VStack>
      </Box>
      <NavFooter/>
    </>
  );
};

export default NavigationMobile;
