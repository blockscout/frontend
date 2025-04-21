import { Icon } from '@chakra-ui/react';
import React from 'react';

import ArrowIcon from 'icons/arrows/east.svg';

import type { IconButtonProps } from '../../chakra/icon-button';
import { IconButton } from '../../chakra/icon-button';
import { Link } from '../../chakra/link';
import { Tooltip } from '../../chakra/tooltip';

export interface BackToButtonProps extends IconButtonProps {
  href?: string;
  hint?: string;
}

export const BackToButton = ({ href, hint, boxSize = 6, ...rest }: BackToButtonProps) => {

  const button = (
    <IconButton { ...rest } boxSize={ boxSize }>
      <Icon
        transform="rotate(180deg)"
        color="icon.backTo"
        _hover={{ color: 'link.primary.hover' }}
        boxSize={ boxSize }
      >
        <ArrowIcon/>
      </Icon>
    </IconButton>
  );

  return (
    <Tooltip content={ hint } disabled={ !hint }>
      { href ? <Link href={ href } asChild>{ button }</Link> : button }
    </Tooltip>
  );
};
