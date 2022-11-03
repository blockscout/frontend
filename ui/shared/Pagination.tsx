import { Button, Flex, Icon, IconButton } from '@chakra-ui/react';
import React from 'react';

import arrowIcon from 'icons/arrows/east-mini.svg';

export type Props = {
  page: number;
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
  resetPage: () => void;
  hasNextPage: boolean;
  hasPaginationParams?: boolean;
}

const Pagination = ({ page, onNextPageClick, onPrevPageClick, resetPage, hasNextPage, hasPaginationParams }: Props) => {

  return (
    <Flex
      fontSize="sm"
      alignItems="center"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={ resetPage }
        disabled={ !hasPaginationParams }
        mr={ 4 }
      >
        First
      </Button>
      <IconButton
        variant="outline"
        onClick={ onPrevPageClick }
        size="sm"
        aria-label="Next page"
        w="36px"
        icon={ <Icon as={ arrowIcon } w={ 5 } h={ 5 }/> }
        mr={ 6 }
        disabled={ page === 1 }
      />
      <Button
        variant="outline"
        size="sm"
        isActive
        borderWidth="1px"
        fontWeight={ 400 }
        h={ 8 }
        cursor="unset"
        disabled={ hasPaginationParams && page === 1 }
      >
        { page }
      </Button>
      <IconButton
        variant="outline"
        onClick={ onNextPageClick }
        size="sm"
        aria-label="Next page"
        w="36px"
        icon={ <Icon as={ arrowIcon } w={ 5 } h={ 5 } transform="rotate(180deg)"/> }
        ml={ 6 }
        disabled={ !hasNextPage }
      />
      { /* not implemented yet */ }
      { /* <Flex alignItems="center" width="132px" ml={ 16 } display={{ base: 'none', lg: 'flex' }}>
            Go to <Input w="84px" size="xs" ml={ 2 }/>
      </Flex> */ }
    </Flex>

  );
};

export default Pagination;
