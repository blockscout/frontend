import { Link, Icon, chakra, Box, Skeleton } from '@chakra-ui/react';
import React from 'react';

import arrowIcon from 'icons/arrows/north-east.svg';

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

const LinkExternal = ({ href, children, className, isLoading }: Props) => {
  if (isLoading) {
    return (
      <Box className={ className } fontSize="sm" lineHeight={ 5 } display="inline-block" alignItems="center">
        { children }
        <Skeleton boxSize={ 4 } verticalAlign="middle" display="inline-block"/>
      </Box>
    );
  }

  return (
    <Link className={ className } fontSize="sm" lineHeight={ 5 } display="inline-block" alignItems="center" target="_blank" href={ href }>
      { children }
      <Icon as={ arrowIcon } boxSize={ 4 } verticalAlign="middle"/>
    </Link>
  );
};

export default React.memo(chakra(LinkExternal));
