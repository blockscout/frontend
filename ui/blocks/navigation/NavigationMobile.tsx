import { Box, VStack } from '@chakra-ui/react';
import React from 'react';

import useNavItems from 'lib/hooks/useNavItems';
import NavFooter from 'ui/blocks/navigation/NavFooter';
import NavLink from 'ui/blocks/navigation/NavLink';

const NavigationMobile = () => {
  const { mainNavItems, accountNavItems } = useNavItems();

  return (
    <>
      <Box as="nav" mt={ 6 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { mainNavItems.map((item) => <NavLink key={ item.text } { ...item }/>) }
        </VStack>
      </Box>
      <Box as="nav" mt={ 6 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { accountNavItems.map((item) => <NavLink key={ item.text } { ...item }/>) }
        </VStack>
      </Box>
      <NavFooter/>
    </>
  );
};

export default NavigationMobile;
