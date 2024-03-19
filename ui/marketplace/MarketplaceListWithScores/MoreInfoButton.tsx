import { Link, Skeleton } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

interface Props {
  onClick: (event: MouseEvent) => void;
  isLoading?: boolean;
}

const MoreInfoButton = ({ onClick, isLoading }: Props) => (
  <Skeleton
    isLoaded={ !isLoading }
    display="inline-flex"
    alignItems="center"
    height="30px"
    borderRadius="base"
  >
    <Link
      fontSize="sm"
      onClick={ onClick }
      fontWeight="500"
      display="inline-flex"
    >
      More info
    </Link>
  </Skeleton>
);

export default MoreInfoButton;
