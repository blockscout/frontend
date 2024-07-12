import { Box, Flex, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { animate, motion, useMotionValue } from 'framer-motion';
import React, { useCallback } from 'react';

import useHasAccount from 'lib/hooks/useHasAccount';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import IconSvg from 'ui/shared/IconSvg';

import NavLink from '../vertical/NavLink';
import NavLinkGroup from './NavLinkGroup';

const DRAWER_WIDTH = 330;

interface Props {
  onNavLinkClick?: () => void;
  isMarketplaceAppPage?: boolean;
}

const NavigationMobile = ({ onNavLinkClick, isMarketplaceAppPage }: Props) => {
  const { mainNavItems, accountNavItems } = useNavItems();

  const [ openedGroupIndex, setOpenedGroupIndex ] = React.useState(-1);

  const mainX = useMotionValue(0);
  const subX = useMotionValue(DRAWER_WIDTH);

  const onGroupItemOpen = (index: number) => () => {
    setOpenedGroupIndex(index);
    animate(mainX, -DRAWER_WIDTH, { ease: 'easeInOut' });
    animate(subX, 0, { ease: 'easeInOut' });
  };

  const onGroupItemClose = useCallback(() => {
    animate(mainX, 0, { ease: 'easeInOut' });
    animate(subX, DRAWER_WIDTH, { ease: 'easeInOut', onComplete: () => setOpenedGroupIndex(-1) });
  }, [ mainX, subX ]);

  const hasAccount = useHasAccount();

  const iconColor = useColorModeValue('blue.600', 'blue.300');

  const openedItem = mainNavItems[openedGroupIndex];

  const isCollapsed = isMarketplaceAppPage ? false : undefined;

  return (
    <Flex position="relative" flexDirection="column" flexGrow={ 1 }>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={ 1 }
        as={ motion.div }
        style={{ x: mainX }}
        maxHeight={ openedGroupIndex > -1 ? '100vh' : 'unset' }
        overflowY={ openedGroupIndex > -1 ? 'hidden' : 'unset' }
      >
        <Box
          as="nav"
          mt={ 6 }
        >
          <VStack
            w="100%"
            as="ul"
            spacing="1"
            alignItems="flex-start"
          >
            { mainNavItems.map((item, index) => {
              if (isGroupItem(item)) {
                return <NavLinkGroup key={ item.text } item={ item } onClick={ onGroupItemOpen(index) } isExpanded={ isMarketplaceAppPage }/>;
              } else {
                return <NavLink key={ item.text } item={ item } onClick={ onNavLinkClick } isCollapsed={ isCollapsed }/>;
              }
            }) }
          </VStack>
        </Box>
        { hasAccount && (
          <Box
            as="nav"
            mt={ 3 }
            pt={ 3 }
            borderTopWidth="1px"
            borderColor="divider"
          >
            <VStack as="ul" spacing="1" alignItems="flex-start">
              { accountNavItems.map((item) => <NavLink key={ item.text } item={ item } onClick={ onNavLinkClick } isCollapsed={ isCollapsed }/>) }
            </VStack>
          </Box>
        ) }
      </Box>
      { openedGroupIndex >= 0 && (
        <Box
          as={ motion.nav }
          w="100%"
          mt={ 6 }
          position="absolute"
          top={ 0 }
          style={{ x: subX }}
          key="sub"
        >
          <Flex alignItems="center" px={ 2 } py={ 2.5 } w="100%" h="50px" onClick={ onGroupItemClose } mb={ 1 }>
            <IconSvg name="arrows/east-mini" boxSize={ 6 } mr={ 2 } color={ iconColor }/>
            <Text variant="secondary" fontSize="sm">{ mainNavItems[openedGroupIndex].text }</Text>
          </Flex>
          <Box
            w="100%"
            as="ul"
          >
            { isGroupItem(openedItem) && openedItem.subItems?.map(
              (item, index) => Array.isArray(item) ? (
                <Box
                  key={ index }
                  w="100%"
                  as="ul"
                  _notLast={{
                    mb: 2,
                    pb: 2,
                    borderBottomWidth: '1px',
                    borderColor: 'divider',
                  }}
                >
                  { item.map(subItem => <NavLink key={ subItem.text } item={ subItem } onClick={ onNavLinkClick } isCollapsed={ isCollapsed }/>) }
                </Box>
              ) :
                <NavLink key={ item.text } item={ item } mb={ 1 } onClick={ onNavLinkClick } isCollapsed={ isCollapsed }/>,
            ) }
          </Box>
        </Box>
      ) }
    </Flex>
  );
};

export default NavigationMobile;
