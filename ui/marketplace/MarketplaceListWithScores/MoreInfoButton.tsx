import { Link } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

interface Props {
  onClick: (event: MouseEvent) => void;
}

const MoreInfoButton = ({ onClick }: Props) => (
  <Link
    fontSize="sm"
    onClick={ onClick }
    fontWeight="500"
    display="inline-flex"
  >
    More info
  </Link>
);

export default MoreInfoButton;
