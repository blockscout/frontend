// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Link } from 'src/toolkit/chakra/link';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  className?: string;
  label?: string;
  href: string;
}

const LinkNewTab = ({ className, label, href }: Props) => {

  return (
    <Tooltip content={ label }>
      <IconButton
        asChild
        aria-label={ label ?? 'Open link' }
        variant="icon_secondary"
        boxSize={ 5 }
        className={ className }
        borderRadius={ 0 }
      >
        <Link href={ href } external noIcon>
          <SpriteIcon name="open-link"/>
        </Link>
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(chakra(LinkNewTab));
