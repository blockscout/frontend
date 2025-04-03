import { chakra, Box } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';

interface Props {
  blockHeight: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

const SearchBarSuggestBlockCountdown = ({ blockHeight, onClick, className }: Props) => {
  return (
    <Box className={ className }>
      <span>Learn </span>
      <Link href={ route({ pathname: '/block/countdown/[height]', query: { height: blockHeight } }) } onClick={ onClick }>
        estimated time for this block
      </Link>
      <span> to be created.</span>
    </Box>
  );
};

export default React.memo(chakra(SearchBarSuggestBlockCountdown));
