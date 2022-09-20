import { Link, Icon } from '@chakra-ui/react';
import React from 'react';

import externalLinkIcon from 'icons/external-link.svg';

interface Props {
  href: string;
  title: string;
}

const ExternalLink = ({ href, title }: Props) => {
  return (
    <Link fontSize="sm" display="inline-flex" alignItems="center" target="_blank" href={ href }>
      { title }
      <Icon as={ externalLinkIcon }/>
    </Link>
  );
};

export default React.memo(ExternalLink);
