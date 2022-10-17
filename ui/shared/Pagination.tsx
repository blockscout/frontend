import { Button, Flex, Input, Icon, IconButton } from '@chakra-ui/react';
import React from 'react';

import arrowIcon from 'icons/arrows/east-mini.svg';

type Props = {
  currentPage: number;
  maxPage?: number;
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
}

const MAX_PAGE_DEFAULT = 50;

const Pagination = ({ currentPage, maxPage, onNextPageClick, onPrevPageClick }: Props) => {
  const pageNumber = (
    <Flex alignItems="center">
      <Button
        variant="outline"
        colorScheme="gray"
        size="sm"
        isActive
        borderWidth="1px"
        fontWeight={ 400 }
        mr={ 3 }
        h={ 8 }
      >
        { currentPage }
      </Button>
          of
      <Button
        variant="outline"
        colorScheme="gray"
        size="sm"
        width={ 8 }
        borderWidth="1px"
        fontWeight={ 400 }
        ml={ 3 }
      >
        { maxPage || MAX_PAGE_DEFAULT }
      </Button>
    </Flex>
  );

  return (
    <Flex
      fontSize="sm"
      width={{ base: '100%', lg: 'auto' }}
      justifyContent={{ base: 'space-between', lg: 'unset' }}
      alignItems="center"
    >
      <Flex alignItems="center" justifyContent="space-between" w={{ base: '100%', lg: 'auto' }}>
        <IconButton
          variant="outline"
          onClick={ onPrevPageClick }
          size="sm"
          aria-label="Next page"
          w="36px"
          icon={ <Icon as={ arrowIcon } w={ 5 } h={ 5 }/> }
          mr={ 8 }
        />
        { pageNumber }
        <IconButton
          variant="outline"
          onClick={ onNextPageClick }
          size="sm"
          aria-label="Next page"
          w="36px"
          icon={ <Icon as={ arrowIcon } w={ 5 } h={ 5 } transform="rotate(180deg)"/> }
          ml={ 8 }
        />
      </Flex>
      <Flex alignItems="center" width="132px" ml={ 16 } display={{ base: 'none', lg: 'flex' }}>
            Go to <Input w="84px" size="xs" ml={ 2 }/>
      </Flex>
    </Flex>

  );
};

export default Pagination;
