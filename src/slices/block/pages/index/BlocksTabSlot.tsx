// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';

import ChainUtilization from 'src/slices/chain/ChainUtilization';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';

interface Props {
  pagination: PaginationParams | null;
}

const BlocksTabSlot = ({ pagination }: Props) => {
  const isMobile = useIsMobile();

  return (
    <Flex alignItems="center" columnGap={ 8 } display="flex">
      { !isMobile && <ChainUtilization label="Utilization (last 50 blocks):"/> }
      <Link href={ route({ pathname: '/block/countdown' }) } textStyle="sm">
        <SpriteIcon name="hourglass" boxSize={ 5 } mr={ 2 }/>
        <span>{ isMobile ? 'Countdown' : 'Block countdown' }</span>
      </Link>
      { pagination && !isMobile && <Pagination my={ 1 } { ...pagination }/> }
    </Flex>
  );
};

export default BlocksTabSlot;
