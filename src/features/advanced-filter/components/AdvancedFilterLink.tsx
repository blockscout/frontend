// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { RouteParams } from 'src/server/routes';
import { route } from 'src/server/routes';

import SpriteIcon from 'src/sprite/SpriteIcon';

import type { LinkProps } from 'src/toolkit/chakra/link';
import { Link } from 'src/toolkit/chakra/link';

interface Props extends LinkProps {
  query?: Record<string, string | Array<string> | undefined>;
  routeParams?: RouteParams;
  adaptive?: boolean;
}

const AdvancedFilterLink = ({ query, routeParams, adaptive = true, ...rest }: Props) => {
  return (
    <Link
      href={ route({ pathname: '/advanced-filter', query }, routeParams) }
      display="flex"
      alignItems="center"
      gap={ 1 }
      textStyle="sm"
      { ...rest }
    >
      <SpriteIcon name="advanced-filter" boxSize={ 5 }/>
      <chakra.span hideBelow={ adaptive ? 'lg' : undefined }>Advanced</chakra.span>
    </Link>
  );
};

export default React.memo(AdvancedFilterLink);
