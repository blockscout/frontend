import { Icon } from '@chakra-ui/react';
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import ArrowIcon from 'icons/arrows/east.svg';

import type { IconButtonProps } from '../chakra/icon-button';
import { IconButton } from '../chakra/icon-button';
import { Link } from '../chakra/link';
import { Tooltip } from '../chakra/tooltip';

interface Props extends IconButtonProps {
  href?: string;
  hint?: string;
}

// TODO @tom2drum organize to a folder
const ButtonBackTo = ({ href, hint, ...rest }: Props) => {

  const button = (
    <IconButton { ...rest } boxSize={ 6 }>
      <Icon
        transform="rotate(180deg)"
        color="icon.backTo"
        _hover={{ color: 'link.primary.hover' }}
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

export default React.memo(ButtonBackTo);
