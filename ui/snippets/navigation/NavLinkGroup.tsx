import {
  Icon,
  Text,
  HStack,
  Flex,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import chevronIcon from 'icons/arrows/east-mini.svg';
import useIsMobile from 'lib/hooks/useIsMobile';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import NavLink from './NavLink';
import useColors from './useColors';

type NavigationLink = {
  text: string;
  url: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  isNewUi: boolean;
  isActive: boolean;
}

interface Props {
  isCollapsed?: boolean;
  isActive?: boolean;
  subItems: Array<NavigationLink>;
  text: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

const NavLinkGroup = ({ text, subItems, icon, isCollapsed, isActive }: Props) => {
  const colors = useColors();

  const isExpanded = isCollapsed === false;

  const isMobile = useIsMobile();

  return (
    <Box as="li" listStyleType="none" w="100%">
      <Popover
        trigger="hover"
        placement={ isMobile ? 'bottom-end' : 'right-start' }
        isLazy
      >
        <PopoverTrigger>
          <Box
            w={{ base: '100%', lg: isExpanded ? '180px' : '60px', xl: isCollapsed ? '60px' : '180px' }}
            pl={{ base: 3, lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 }}
            pr={{ base: 3, lg: isExpanded ? 0 : '15px', xl: isCollapsed ? '15px' : 0 }}
            py={ 2.5 }
            display="flex"
            color={ isActive ? colors.text.active : colors.text.default }
            bgColor={ isActive ? colors.bg.active : colors.bg.default }
            _hover={{ color: isActive ? colors.text.active : colors.text.hover }}
            borderRadius="base"
            whiteSpace="nowrap"
            aria-label={ `${ text } link group` }
            { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
          >
            <Flex justifyContent="space-between" width="100%" alignItems="center" pr={ 1 }>
              <HStack spacing={ 3 } overflow="hidden">
                <Icon as={ icon } boxSize="30px"/>
                <Text
                  variant="inherit"
                  fontSize="sm"
                  lineHeight="20px"
                  opacity={{ base: '1', lg: isExpanded ? '1' : '0', xl: isCollapsed ? '0' : '1' }}
                  transitionProperty="opacity"
                  transitionDuration="normal"
                  transitionTimingFunction="ease"
                >
                  { text }
                </Text>
              </HStack>
              { isExpanded && <Icon as={ chevronIcon } transform="rotate(180deg)" boxSize={ 6 }/> }
            </Flex>
          </Box>
        </PopoverTrigger>
        <PopoverContent width="auto">
          <PopoverBody p={ 4 }>
            <VStack spacing={ 1 } alignItems="start">
              { subItems.map(item => <NavLink key={ item.text } { ...item } isCollapsed={ false }/>) }
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default NavLinkGroup;
