// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';

import ChainUtilization from 'src/slices/chain/ChainUtilization';

import Pagination from 'src/shared/pagination/Pagination';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';

interface Props {
  pagination: PaginationParams | null;
}

const BlocksTabSlot = ({ pagination }: Props) => {
  return (
    <Flex alignItems="center" columnGap={ 8 } display={{ base: 'none', lg: 'flex' }}>
      <ChainUtilization label="Utilization (last 50 blocks):"/>
      <Link href={ route({ pathname: '/block/countdown' }) } textStyle="sm">
        <SpriteIcon name="hourglass" boxSize={ 5 } mr={ 2 }/>
        <span>Block countdown</span>
      </Link>
      { pagination && <Pagination my={ 1 } { ...pagination }/> }
    </Flex>
  );
};

export default BlocksTabSlot;
