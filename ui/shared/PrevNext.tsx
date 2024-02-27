import { Box, IconButton, chakra, Tooltip, Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
  onClick: (direction: 'prev' | 'next') => void;
  prevLabel?: string;
  nextLabel?: string;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
  isLoading?: boolean;
}

const PrevNext = ({ className, onClick, prevLabel, nextLabel, isPrevDisabled, isNextDisabled, isLoading }: Props) => {
  const handelPrevClick = React.useCallback(() => {
    onClick('prev');
  }, [ onClick ]);

  const handelNextClick = React.useCallback(() => {
    onClick('next');
  }, [ onClick ]);

  if (isLoading) {
    return (
      <Flex columnGap="10px" className={ className }>
        <Skeleton boxSize={ 6 } borderRadius="sm"/>
        <Skeleton boxSize={ 6 } borderRadius="sm"/>
      </Flex>
    );
  }

  return (
    <Box className={ className }>
      <Tooltip label={ prevLabel }>
        <IconButton
          aria-label="prev"
          icon={ <IconSvg name="arrows/east-mini" boxSize={ 6 }/> }
          h={ 6 }
          borderRadius="sm"
          variant="subtle"
          colorScheme="gray"
          onClick={ handelPrevClick }
          isDisabled={ isPrevDisabled }
        />
      </Tooltip>
      <Tooltip label={ nextLabel }>
        <IconButton
          aria-label="next"
          icon={ <IconSvg name="arrows/east-mini" boxSize={ 6 } transform="rotate(180deg)"/> }
          h={ 6 }
          borderRadius="sm"
          variant="subtle"
          colorScheme="gray"
          ml="10px"
          onClick={ handelNextClick }
          isDisabled={ isNextDisabled }
        />
      </Tooltip>
    </Box>
  );
};

export default chakra(PrevNext);
