import { Button, Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from './types';

import Skeleton from 'ui/shared/chakra/Skeleton';

interface Props extends PaginationParams {
  className?: string;
}

const Pagination = ({ page, onNextPageClick, onPrevPageClick, resetPage, hasPages, hasNextPage, className, canGoBackwards, isLoading, isVisible }: Props) => {

  if (!isVisible) {
    return null;
  }

  const showSkeleton = page === 1 && !hasPages && isLoading;

  return (
    <Flex
      className={ className }
      fontSize="sm"
      alignItems="center"
    >
      <Skeleton isLoaded={ !showSkeleton } display="inline-block" mr={ 4 } borderRadius="base">
        <Button
          size="sm"
          px="24px"
          py="12px"
          h={ 9 }
          fontWeight={ 400 }
          onClick={ resetPage }
          isDisabled={ page === 1 || isLoading }
        >
          First
        </Button>
      </Skeleton>
      <Skeleton isLoaded={ !showSkeleton } display="inline-block" mr={ 3 } borderRadius="base">
        <Button
          size="sm"
          px="24px"
          py="12px"
          fontWeight={ 400 }
          data-selected={ true }
          h={ 9 }
          minW="36px"
          cursor="unset"
          isDisabled={ !canGoBackwards || isLoading }
          onClick={ onPrevPageClick }
        >
          { '<' }
        </Button>
      </Skeleton>
      <Skeleton isLoaded={ !showSkeleton } display="inline-block" borderRadius="base">
        <Button
          size="sm"
          px="24px"
          py="12px"
          fontWeight={ 400 }
          data-selected={ true }
          h={ 9 }
          minW="36px"
          cursor="unset"
        >
          { page }
        </Button>
      </Skeleton>
      <Skeleton isLoaded={ !showSkeleton } display="inline-block" ml={ 3 } borderRadius="base">
        { '>' }
        <Button
          size="sm"
          px="24px"
          py="12px"
          fontWeight={ 400 }
          data-selected={ true }
          h={ 9 }
          minW="36px"
          cursor="unset"
          isDisabled={ !hasNextPage || isLoading }
          onClick={ onNextPageClick }
        >
          { '<' }
        </Button>
      </Skeleton>
      { /* not implemented yet */ }
      { /* <Flex alignItems="center" width="132px" ml={ 16 } display={{ base: 'none', lg: 'flex' }}>
            Go to <Input w="84px" size="xs" ml={ 2 }/>
      </Flex> */ }
    </Flex>

  );
};

export default chakra(Pagination);
