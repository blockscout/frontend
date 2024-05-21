import { Link, Text, HStack, chakra, shouldForwardProp, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { DeFiDropdownItem as TDeFiDropdownItem } from 'types/client/deFiDropdown';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import IconSvg from 'ui/shared/IconSvg';

type Props = {
  item: TDeFiDropdownItem & { onClick: () => void };
}

const DeFiDropdownItem = ({ item }: Props) => {
  const nextRoute: Route = { pathname: '/apps/[id]', query: { id: item.dappId || '', action: 'connect' } };
  const href = item.dappId ? route(nextRoute) : item.url;

  const content = (
    <Link
      href={ href }
      target={ item.dappId ? '_self' : '_blank' }
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
          { !item.dappId && <IconSvg name="arrows/north-east" boxSize={ 4 } color="text_secondary" verticalAlign="middle"/> }
        </Text>
      </HStack>
    </Link>
  );

  return item.dappId ? (
    <NextLink href={ nextRoute } passHref legacyBehavior>
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
