import { Link, Icon } from '@chakra-ui/react';
import React from 'react';

import arrowIcon from 'icons/arrows/north-east.svg';

interface Props {
  href: string;
  title: string;
}

const ExternalLink = ({ href, title }: Props) => {
  return (
    <Link fontSize="sm" display="inline-flex" alignItems="center" target="_blank" href={ href }>
      { title }
      <Icon as={ arrowIcon } boxSize={ 4 }/>
    </Link>
  );
};

export default React.memo(ExternalLink);
