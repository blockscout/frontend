import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex, Input, IconButton } from '@chakra-ui/react';
import React from 'react';

type Props = {
  currentPage: number;
  maxPage?: number;
  isMobile?: boolean;
}

const MAX_PAGE_DEFAULT = 50;

const Pagination = ({ currentPage, maxPage, isMobile }: Props) => {

  return (
    <Flex
      fontSize="sm"
      width={ isMobile ? '100%' : '434px' }
      justifyContent="space-between"
    >
      <Flex alignItems="center" justifyContent="space-between" flexGrow={ 1 }>
        <IconButton
          variant="outline"
          size="sm"
          aria-label="Next page"
          w="36px"
          icon={ <ChevronLeftIcon w={ 5 } h={ 5 }/> }
        />
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
        <IconButton
          variant="outline"
          size="sm"
          aria-label="Next page"
          w="36px"
          icon={ <ChevronRightIcon w={ 5 } h={ 5 }/> }
        />
      </Flex>
      { !isMobile && (
        <Flex alignItems="center" width="132px" ml={ 16 }>
            Go to <Input w="84px" h="32px" size="sm" ml={ 2 }/>
        </Flex>
      ) }
    </Flex>
  );
};

export default Pagination;
