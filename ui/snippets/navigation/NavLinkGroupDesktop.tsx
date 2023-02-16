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

const NavLinkGroupDesktop = ({ text, subItems, icon, isCollapsed, isActive }: Props) => {
  const colors = useColors();

  const isExpanded = isCollapsed === false;

  return (
    <Box as="li" listStyleType="none" w="100%">
      <Popover
        trigger="hover"
        placement="right-start"
        isLazy
      >
        <PopoverTrigger>
          <Box
            w={{ lg: isExpanded ? '180px' : '60px', xl: isCollapsed ? '60px' : '180px' }}
            pl={{ lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 }}
            pr={{ lg: isExpanded ? 0 : '15px', xl: isCollapsed ? '15px' : 0 }}
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
                  opacity={{ lg: isExpanded ? '1' : '0', xl: isCollapsed ? '0' : '1' }}
                  transitionProperty="opacity"
                  transitionDuration="normal"
                  transitionTimingFunction="ease"
                >
                  { text }
                </Text>
              </HStack>
              <Icon
                as={ chevronIcon }
                transform="rotate(180deg)"
                boxSize={ 6 }
                display={{ lg: isExpanded ? 'block' : 'none', xl: isCollapsed ? 'none' : 'block' }}
              />
            </Flex>
          </Box>
        </PopoverTrigger>
        <PopoverContent width="auto" top={{ lg: isExpanded ? '-16px' : 0, xl: isCollapsed ? 0 : '-16px' }}>
          <PopoverBody p={ 4 }>
            <Text variant="secondary" fontSize="sm" mb={ 2 } display={{ lg: isExpanded ? 'none' : 'block', xl: isCollapsed ? 'block' : 'none' }}>
              { text }
            </Text>
            <VStack spacing={ 1 } alignItems="start">
              { subItems.map(item => <NavLink key={ item.text } { ...item } isCollapsed={ false }/>) }
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default NavLinkGroupDesktop;
