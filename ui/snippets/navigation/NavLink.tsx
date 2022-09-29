import { Link, Icon, Text, HStack, Tooltip, Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import useColors from './useColors';

interface Props {
  isCollapsed?: boolean;
  isActive?: boolean;
  url: string;
  text: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  px?: string | number;
}

const NavLink = ({ text, url, icon, isCollapsed, isActive, px }: Props) => {
  const colors = useColors();

  const isExpanded = isCollapsed === false;

  return (
    <Box as="li" listStyleType="none" w="100%">
      <NextLink href={ url } passHref>
        <Link
          w={{ base: '100%', lg: isExpanded ? '180px' : '60px', xl: isCollapsed ? '60px' : '180px' }}
          px={ px || { base: 3, lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 } }
          py={ 2.5 }
          display="flex"
          color={ isActive ? colors.text.active : colors.text.default }
          bgColor={ isActive ? colors.bg.active : colors.bg.default }
          _hover={{ color: isActive ? colors.text.active : colors.text.hover }}
          borderRadius="base"
          whiteSpace="nowrap"
          { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
        >
          <Tooltip
            label={ text }
            hasArrow={ false }
            isDisabled={ !isCollapsed }
            placement="right"
            variant="nav"
            gutter={ 15 }
            color={ isActive ? colors.text.active : colors.text.hover }
          >
            <HStack spacing={ 3 }>
              <Icon as={ icon } boxSize="30px"/>
              <Text
                variant="inherit"
                fontSize="sm"
                lineHeight="20px"
                display={{ base: 'block', lg: isExpanded ? 'block' : 'none', xl: isCollapsed ? 'none' : 'block' }}
              >
                { text }
              </Text>
            </HStack>
          </Tooltip>
        </Link>
      </NextLink>
    </Box>
  );
};

export default React.memo(NavLink);
