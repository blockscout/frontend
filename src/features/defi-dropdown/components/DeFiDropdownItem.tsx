// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { DeFiDropdownItem as TDeFiDropdownItem } from '../types/client';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';

type Props = {
  item: TDeFiDropdownItem & { onClick: () => void };
};

const DeFiDropdownItem = ({ item }: Props) => {
  return (
    <Link
      href={ item.dappId ?
        route({
          pathname: item.isEssentialDapp ? '/essential-dapps/[id]' : '/apps/[id]',
          query: { id: item.dappId, action: 'connect' },
        }) :
        item.url
      }
      external={ !item.dappId }
      w="100%"
      h="34px"
      variant="menu"
      onClick={ item.onClick }
    >
      { item.icon && <SpriteIcon name={ item.icon } boxSize={ 5 } mr={ 2 }/> }
      <Text as="span" fontSize="sm">{ item.text }</Text>
    </Link>
  );
};

export default React.memo(DeFiDropdownItem);
