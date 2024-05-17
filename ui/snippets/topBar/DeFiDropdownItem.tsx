import { Link, Text, HStack, chakra, shouldForwardProp, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  item: {
    icon: IconName;
    text: string;
    nextRoute?: Route;
    url?: string;
    onClick: () => void;
  };
}

const DeFiDropdownItem = ({ item }: Props) => {
  const href = item.nextRoute ? route(item.nextRoute) : item.url;

  const content = (
    <Link
      href={ href }
      target={ item.nextRoute ? '_self' : '_blank' }
      w="100%"
      h="34px"
      display="flex"
      aria-label={ `${ item.text } link` }
      whiteSpace="nowrap"
      color={ useColorModeValue('blackAlpha.800', 'gray.400') }
      onClick={ item.onClick }
      _hover={{
        '& *': {
          color: 'link_hovered',
        },
      }}
    >
      <HStack spacing={ 2 } overflow="hidden">
        <IconSvg name={ item.icon } boxSize={ 5 }/>
        <Text as="span" fontSize="sm">
          <span>{ item.text }</span>
          { !item.nextRoute && <IconSvg name="arrows/north-east" boxSize={ 4 } color="text_secondary" verticalAlign="middle"/> }
        </Text>
      </HStack>
    </Link>
  );

  return item.nextRoute ? (
    <NextLink href={ item.nextRoute } passHref legacyBehavior>
      { content }
    </NextLink>
  ) : content;
};

const DeFiDropdownItemChakra = chakra(DeFiDropdownItem, {
  shouldForwardProp: (prop) => {
    const isChakraProp = !shouldForwardProp(prop);

    if (isChakraProp && prop !== 'px') {
      return false;
    }

    return true;
  },
});

export default React.memo(DeFiDropdownItemChakra);
