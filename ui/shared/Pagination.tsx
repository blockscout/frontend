import { Button, Flex, Input, Icon, IconButton } from '@chakra-ui/react';
import React from 'react';

import arrowIcon from 'icons/arrows/east-mini.svg';

type Props = {
  currentPage: number;
  maxPage?: number;
  isMobile?: boolean;
}

const MAX_PAGE_DEFAULT = 50;

const Pagination = ({ currentPage, maxPage, isMobile }: Props) => {

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

  if (isMobile) {
    return (
      <Flex
        fontSize="sm"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <IconButton
          variant="outline"
          size="sm"
          aria-label="Next page"
          w="36px"
          icon={ <Icon as={ arrowIcon } w={ 5 } h={ 5 }/> }
        />
        { pageNumber }
        <IconButton
          variant="outline"
          size="sm"
          aria-label="Next page"
          w="36px"
          icon={ <Icon as={ arrowIcon } w={ 5 } h={ 5 } transform="rotate(180deg)"/> }
        />
      </Flex>
    );
  }

  return (
    <Flex
      fontSize="sm"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Button
          variant="outline"
          size="sm"
          aria-label="Next page"
          leftIcon={ <Icon as={ arrowIcon } w={ 5 } h={ 5 }/> }
          mr={ 8 }
          pl={ 1 }
        >
          Previous
        </Button>
        { pageNumber }
        <Button
          variant="outline"
          size="sm"
          aria-label="Next page"
          rightIcon={ <Icon as={ arrowIcon } w={ 5 } h={ 5 } transform="rotate(180deg)"/> }
          ml={ 8 }
          pr={ 1 }
        >
          Next
        </Button>
      </Flex>
      <Flex alignItems="center" width="132px" ml={ 16 }>
        Go to <Input w="84px" size="xs" ml={ 2 }/>
      </Flex>
    </Flex>
  );
};

export default Pagination;
