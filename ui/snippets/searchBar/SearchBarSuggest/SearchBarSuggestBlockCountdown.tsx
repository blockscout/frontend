import { Box } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import LinkInternal from 'ui/shared/links/LinkInternal';

interface Props {
  height: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SearchBarSuggestBlockCountdown = ({ height, onClick }: Props) => {
  return (
    <Box>
      <span>Learn </span>
      <LinkInternal href={ route({ pathname: '/block/countdown/[height]', query: { height } }) } onClick={ onClick }>
        estimated time for this block
      </LinkInternal>
      <span> to be created.</span>
    </Box>
  );
};

export default React.memo(SearchBarSuggestBlockCountdown);
