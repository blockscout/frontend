import { chakra } from '@chakra-ui/react';
import React from 'react';

type Props = {
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  href?: string;
  target?: string;
  children: React.ReactNode;
};

const SearchBarSuggestItemLink = React.forwardRef<HTMLAnchorElement, Props>(({ onClick, href, target, children }, ref) => {
  return (
    <chakra.a
      ref={ ref }
      py={ 3 }
      px={ 1 }
      display="flex"
      flexDir="column"
      rowGap={ 2 }
      borderColor="border.divider"
      borderBottomWidth="1px"
      _last={{
        borderBottomWidth: '0',
      }}
      _hover={{
        bgColor: { _light: 'blue.50', _dark: 'gray.800' },
      }}
      textStyle="sm"
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
});

export default SearchBarSuggestItemLink;
