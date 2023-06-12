import { Button, Skeleton, Flex, Icon, IconButton, chakra } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from './types';

import arrowIcon from 'icons/arrows/east-mini.svg';

interface Props extends PaginationParams {
  className?: string;
}

const Pagination = ({ page, onNextPageClick, onPrevPageClick, resetPage, hasNextPage, className, canGoBackwards, isLoading, isVisible }: Props) => {

  if (!isVisible) {
    return null;
  }

  return (
    <Flex
      className={ className }
      fontSize="sm"
      alignItems="center"
    >
      <Skeleton isLoaded={ !isLoading } display="inline-block" mr={ 4 } borderRadius="base">
        <Button
          variant="outline"
          size="sm"
          onClick={ resetPage }
          isDisabled={ page === 1 }
        >
        First
        </Button>
      </Skeleton>
      <Skeleton isLoaded={ !isLoading } display="inline-block" mr={ 3 } borderRadius="base">
        <IconButton
          variant="outline"
          onClick={ onPrevPageClick }
          size="sm"
          aria-label="Prev page"
          w="36px"
          icon={ <Icon as={ arrowIcon } w={ 5 } h={ 5 }/> }
          isDisabled={ !canGoBackwards || page === 1 }
        />
      </Skeleton>
      <Skeleton isLoaded={ !isLoading } display="inline-block" borderRadius="base">
        <Button
          variant="outline"
          size="sm"
          isActive
          borderWidth="1px"
          fontWeight={ 400 }
          h={ 8 }
          cursor="unset"
        >
          { page }
        </Button>
      </Skeleton>
      <Skeleton isLoaded={ !isLoading } display="inline-block" ml={ 3 } borderRadius="base">
        <IconButton
          variant="outline"
          onClick={ onNextPageClick }
          size="sm"
          aria-label="Next page"
          w="36px"
          icon={ <Icon as={ arrowIcon } w={ 5 } h={ 5 } transform="rotate(180deg)"/> }
          isDisabled={ !hasNextPage }
        />
      </Skeleton>
      { /* not implemented yet */ }
      { /* <Flex alignItems="center" width="132px" ml={ 16 } display={{ base: 'none', lg: 'flex' }}>
            Go to <Input w="84px" size="xs" ml={ 2 }/>
      </Flex> */ }
    </Flex>

  );
};

export default chakra(Pagination);
