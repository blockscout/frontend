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

export const BackToButton = ({ href, hint, ...rest }: BackToButtonProps) => {

  const button = (
    <IconButton { ...rest }>
      <Icon
        transform="rotate(180deg)"
        color="icon.backTo"
        _hover={{ color: 'link.primary.hover' }}
        boxSize={ 6 }
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
