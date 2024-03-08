import { Link } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  children: string;
  onClick: (event: MouseEvent) => void;
  icon?: IconName;
  iconColor?: string;
  fontSize?: string;
  fontWeight?: string;
}

const LinkButton = ({ children, onClick, icon, iconColor = 'gray.500', fontSize = 'sm', fontWeight = '500' }: Props) => {
  return (
    <Link
      fontSize={ fontSize }
      href="#"
      onClick={ onClick }
      fontWeight={ fontWeight }
      display="inline-flex"
    >
      { icon && <IconSvg name={ icon } boxSize={ 5 } color={ iconColor } mr={ 1 }/> }
      { children }
    </Link>
  );
};

export default LinkButton;
