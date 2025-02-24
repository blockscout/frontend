import React from 'react';

import type { ButtonProps } from 'toolkit/chakra/button';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends ButtonProps {
  href?: string;
  hint?: string;
}

const ButtonBackTo = ({ href, hint, ...rest }: Props) => {

  const button = (
    <IconButton { ...rest }>
      <IconSvg
        name="arrows/east"
        boxSize={ 6 }
        transform="rotate(180deg)"
        color="icon.backTo"
        _hover={{ color: 'link.primary.hover' }}
      />
    </IconButton>
  );

  return (
    <Tooltip content={ hint } disabled={ !hint }>
      { href ? <Link href={ href } asChild>{ button }</Link> : button }
    </Tooltip>
  );
};

export default React.memo(ButtonBackTo);
