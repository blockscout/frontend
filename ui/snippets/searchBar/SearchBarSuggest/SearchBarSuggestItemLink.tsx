import { chakra } from '@chakra-ui/react';
import React from 'react';

type Props = {
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  href?: string;
  target?: string;
  children: React.ReactNode;
  isFirst?: boolean;
}

const SearchBarSuggestItemLink = ({ onClick, href, target, children, isFirst }: Props) => {
  return (
    <chakra.a
      py={ 3 }
      px={ 2 }
      display="flex"
      flexDir="column"
      rowGap={ 2 }
      borderColor="divider"
      borderBottomWidth="1px"
      _last={{
        borderBottomWidth: '0',
      }}
      bgColor={ isFirst ? 'rgba(160, 126, 255, 0.10)' : 'transparent' }
      borderRadius="12px"
      _hover={{
        bgColor: 'rgba(160, 126, 255, 0.10)',
      }}
      fontSize="sm"
      // _first={{
      //   mt: 2,
      // }}
      onClick={ onClick }
      href={ href }
      target={ target }
    >
      { children }
    </chakra.a>
  );
};

export default SearchBarSuggestItemLink;
