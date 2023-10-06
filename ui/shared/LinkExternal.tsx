import type { ChakraProps } from '@chakra-ui/react';
import { Link, Icon, chakra, Box, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import arrowIcon from 'icons/arrows/north-east.svg';

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: 'subtle';
}

const LinkExternal = ({ href, children, className, isLoading, variant }: Props) => {
  const subtleLinkBg = useColorModeValue('gray.100', 'gray.700');

  const styleProps: ChakraProps = (() => {
    switch (variant) {
      case 'subtle': {
        return {
          px: '10px',
          py: '5px',
          bgColor: subtleLinkBg,
          borderRadius: 'base',
        };
      }

      default:{
        return {};
      }
    }
  })();

  if (isLoading) {
    return (
      <Box className={ className } { ...styleProps } fontSize="sm" lineHeight={ 5 } display="inline-block" alignItems="center">
        { children }
        <Skeleton boxSize={ 4 } verticalAlign="middle" display="inline-block"/>
      </Box>
    );
  }

  return (
    <Link className={ className } { ...styleProps } fontSize="sm" lineHeight={ 5 } display="inline-block" alignItems="center" target="_blank" href={ href }>
      { children }
      <Icon as={ arrowIcon } boxSize={ 4 } verticalAlign="middle" color="gray.400"/>
    </Link>
  );
};

export default React.memo(chakra(LinkExternal));
