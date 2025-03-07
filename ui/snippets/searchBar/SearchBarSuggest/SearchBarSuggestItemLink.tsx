import { chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

type Props = {
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  href?: string;
  target?: string;
  children: React.ReactNode;
};

const SearchBarSuggestItemLink = ({ onClick, href, target, children }: Props) => {
  return (
    <chakra.a
      py={ 3 }
      px={ 1 }
      display="flex"
      flexDir="column"
      rowGap={ 2 }
      borderColor="divider"
      borderBottomWidth="1px"
      _last={{
        borderBottomWidth: '0',
      }}
      _hover={{
        bgColor: useColorModeValue('blue.50', 'gray.800'),
      }}
      fontSize="sm"
      _first={{
        mt: 2,
      }}
      onClick={ onClick }
      href={ href }
      target={ target }
    >
      { children }
    </chakra.a>
  );
};

export default SearchBarSuggestItemLink;
