import { Link, Icon, chakra } from '@chakra-ui/react';
import React from 'react';

import arrowIcon from 'icons/arrows/north-east.svg';

interface Props {
  href: string;
  title: string;
  className?: string;
}

const LinkExternal = ({ href, title, className }: Props) => {
  return (
    <Link className={ className } fontSize="sm" display="inline-flex" alignItems="center" target="_blank" href={ href }>
      { title }
      <Icon as={ arrowIcon } boxSize={ 4 }/>
    </Link>
  );
};

export default React.memo(chakra(LinkExternal));
