import { Flex, Box, HStack, PopoverTrigger, PopoverContent, PopoverBody, VStack, useColorModeValue } from '@chakra-ui/react';
import React, { useState } from 'react';

import config from 'configs/app';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import useIsAuth from 'ui/snippets/auth/useIsAuth';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenu from 'ui/snippets/networkMenu/NetworkMenu';
import Popover from 'ui/shared/chakra/Popover';


import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';
import NavLinkRewards from './NavLinkRewards';
import { NavItem } from 'types/client/navigation';

const NavigationDesktop = () => {
  const { mainNavItems, accountNavItems } = useNavItems();
  const [subLinks, setSubLinks] = useState<NavItem[] | NavItem[][] | null>(null)
  const [open, setOpen] = useState(false)
  const navBg = useColorModeValue('white', 'grey.10')
  const borderColor = useColorModeValue('transparent', 'rgba(255, 255, 255, 0.30)')

  const isAuth = useIsAuth();

  const isCollapsed = false;
  const isExpanded = isCollapsed === false;

  const onMouseOver = (subItems: NavItem[] | NavItem[][] | null) => {
    setSubLinks(subItems)
  }
  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      px={ 12 }
      py={ 2 }
      m="0 auto"
    >
      { /*<TestnetBadge position="absolute" pl={ 3 } w="49px" top="34px"/>*/ }
      <Box
        as="header"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
        w="100%"
        pr={{ lg: isExpanded ? 0 : '15px', xl: isCollapsed ? '15px' : 0 }}
        h={ 10 }
        transitionProperty="padding"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      >
        <NetworkLogo isCollapsed={ isCollapsed }/>
        { Boolean(config.UI.navigation.featuredNetworks) && <NetworkMenu isCollapsed={ isCollapsed }/> }
      </Box>
      <Popover
        trigger="hover"
        placement="bottom"
        // should not be lazy to help google indexing pages
        isLazy={ false }
        gutter={ 8 }
        matchWidth
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <PopoverTrigger>
          <Box
            as="nav"
            p="4px"
            background={open && subLinks ? navBg : "transparent"}
            border={`1px solid ${open && subLinks ? borderColor : "transparent"}`}
            borderBottom="none"
            style={open && subLinks ? {
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            } : {}}
          >
            <HStack as="ul" spacing="0" gap="0" alignItems="flex-start">
              { mainNavItems.map((item) => {
                if (isGroupItem(item)) {
                  return (
                    <NavLinkGroup
                      hideSublinks
                      onMouseOver={() => onMouseOver(item.subItems)}
                      key={ item.text }
                      item={ item }
                      isCollapsed={ isCollapsed }
                    />
                  );
                } else {
                  return <NavLink onMouseOver={() => onMouseOver(null)} key={ item.text } isMainNav item={ item } isCollapsed={ isCollapsed }/>;
                }
              }) }
            </HStack>
          </Box>
        </PopoverTrigger>
        {subLinks && <PopoverContent
          maxW="100%" w="100%" top={{ lg: isExpanded ? '-8px' : 0, xl: isCollapsed ? 0 : '-8px' }}
          border={`1px solid ${borderColor}`}
          borderTop="none"
          borderBottomLeftRadius="16px"
          borderBottomRightRadius="16px"
          borderTopLeftRadius="0px"
          borderTopRadius="0px"
          boxShadow="none"
        >
          <PopoverBody
            p={ 1 }
          >
            <VStack spacing={ 1 } alignItems="start" as="ul">
              { subLinks?.map((subItem, index) => Array.isArray(subItem) ? (
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
                  { subItem.map(subSubItem => <NavLink key={ subSubItem.text } item={ subSubItem } isCollapsed={ false }/>) }
                </Box>
              ) :
                <NavLink key={ subItem.text } item={ subItem } isCollapsed={ false }/>,
              ) }
            </VStack>
          </PopoverBody>
        </PopoverContent>}
      </Popover>
      { isAuth && (
        <Box as="nav" borderTopWidth="1px" borderColor="divider" w="100%" mt={ 3 } pt={ 3 }>
          <HStack as="ul" spacing="1" alignItems="flex-start">
            <NavLinkRewards isCollapsed={ isCollapsed }/>
            { accountNavItems.map((item) => <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>) }
          </HStack>
        </Box>
      ) }
    </Flex>
  );
};

export default NavigationDesktop;
