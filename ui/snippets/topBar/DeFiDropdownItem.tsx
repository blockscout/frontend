import { Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { DeFiDropdownItem as TDeFiDropdownItem } from 'types/client/deFiDropdown';

import { route } from 'nextjs-routes';

import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';
import LinkInternal from 'ui/shared/links/LinkInternal';

type Props = {
  item: TDeFiDropdownItem & { onClick: () => void };
};

const DeFiDropdownItem = ({ item }: Props) => {
  const styles = {
    width: '100%',
    height: '34px',
    display: 'inline-flex',
    alignItems: 'center',
    color: useColorModeValue('blackAlpha.800', 'gray.400'),
    _hover: {
      textDecoration: 'none',
      '& *': {
        color: 'link_hovered',
      },
    },
  };

  const content = (
    <>
      <IconSvg name={ item.icon } boxSize={ 5 } mr={ 2 }/>
      <Text as="span" fontSize="sm">{ item.text }</Text>
    </>
  );

  return item.dappId ? (
    <LinkInternal
      href={ route({ pathname: '/apps/[id]', query: { id: item.dappId, action: 'connect' } }) }
      target="_self"
      { ...styles }
    >
      { content }
    </LinkInternal>
  ) : (
    <LinkExternal href={ item.url } { ...styles }>
      { content }
    </LinkExternal>
  );
};

export default React.memo(DeFiDropdownItem);
