import { Box, Icon, IconButton, chakra, Tooltip } from '@chakra-ui/react';
import React from 'react';

import eastArrow from 'icons/arrows/east-mini.svg';

interface Props {
  className?: string;
  onClick: (direction: 'prev' | 'next') => void;
  prevLabel?: string;
  nextLabel?: string;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
}

const PrevNext = ({ className, onClick, prevLabel, nextLabel, isPrevDisabled, isNextDisabled }: Props) => {
  const handelPrevClick = React.useCallback(() => {
    onClick('prev');
  }, [ onClick ]);

  const handelNextClick = React.useCallback(() => {
    onClick('next');
  }, [ onClick ]);

  return (
    <Box className={ className }>
      <Tooltip label={ prevLabel }>
        <IconButton
          aria-label="prev"
          icon={ <Icon as={ eastArrow } boxSize={ 6 }/> }
          h={ 6 }
          borderRadius="sm"
          variant="subtle"
          colorScheme="gray"
          onClick={ handelPrevClick }
          disabled={ isPrevDisabled }
        />
      </Tooltip>
      <Tooltip label={ nextLabel }>
        <IconButton
          aria-label="next"
          icon={ <Icon as={ eastArrow }boxSize={ 6 } transform="rotate(180deg)"/> }
          h={ 6 }
          borderRadius="sm"
          variant="subtle"
          colorScheme="gray"
          ml="10px"
          onClick={ handelNextClick }
          disabled={ isNextDisabled }
        />
      </Tooltip>
    </Box>
  );
};

export default chakra(PrevNext);
